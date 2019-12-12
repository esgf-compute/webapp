import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http';

import { WPSService, WPSResponse } from '../core/wps.service';
import { Job, Status, Message } from './job';
import { ConfigService } from '../core/config.service';
import { AuthService } from '../core/auth.service';

export class User {
  constructor(
    public username: string = '',
    public openID: string = '',
    public email: string = '',
    public api_key: string = '',
    public type: string = '',
    public local_init?: boolean,
    public expires?: number,
  ) { }

  toUrlEncoded(): string {
    let params = '';
    let fields = ['email'];

    for (let k of fields) {
      if (this[k] != undefined) {
        params += `${k.toLowerCase()}=${this[k]}&`;
      }
    }

    return params;
  }
}

@Injectable()
export class UserService extends WPSService {
  count: number;
  next: string;
  previous: string;

  constructor(
    http: Http,
    private configService: ConfigService,
    private authService: AuthService
  ) { 
    super(http); 
  }

  fixHttpUrl(value: string) {
    if (value.startsWith('http://')) {
      return value.replace('http', 'https');
    }

    return value;
  }

  retrieveJobStatus(target: Job) {
    let promises = target.statusUrls.map((url: string) => {
      url = this.fixHttpUrl(url);

      let headers = new Headers();

      headers.append('COMPUTE-TOKEN', this.authService.user.api_key);

      return this.get(url, null, headers)
        .then((data: any) => {
          return new Status(data);
        });
    });

    Promise.all(promises)
      .then((values: any[]) => {
        target.status = values.sort((a: any, b: any) => {
          if (a.id > b.id) {
            return 1;
          } else if (a.id < b.id) {
            return -1;
          } else {
            return 0;
          }
        });
      });
  }

  queryJobHistory(url: string, params: any = {}): Promise<Job[]> {
    let headers = new Headers();

    headers.append('COMPUTE-TOKEN', this.authService.user.api_key);

    return this.get(url, params, headers)
      .then((data: any) => {
        this.count = data.count;
        (data.next === null) ? this.next = null : this.next = this.fixHttpUrl(data.next);
        (data.previous === null) ? this.previous = null : this.previous = this.fixHttpUrl(data.previous);

        return data.results.map((item: any) => new Job(item));
      });
  }

  jobs(sortKey: string, limit: number): Promise<Job[]> {
    let params = {
      'ordering': sortKey,
      'limit': limit,
    };

    return this.queryJobHistory(this.configService.jobsPath, params);
  }

  canNextJobs(): boolean {
    return this.next == null ? false : true;
  }

  canPreviousJobs(): boolean {
    return this.previous == null ? false : true;
  }

  nextJobs(): Promise<Job[]> {
    return this.queryJobHistory(this.next);
  }

  previousJobs(): Promise<Job[]> {
    return this.queryJobHistory(this.previous);
  }

  removeAll() {
    let url = `${this.configService.jobsPath}remove_all/`;
    let headers = new Headers();

    headers.append('COMPUTE-TOKEN', this.authService.user.api_key);

    return this.delete(url, headers);
  }

  deleteJob(target: Job): Promise<any> {
    let url = `${this.configService.jobsPath}${target.id}/`;
    let headers = new Headers();

    headers.append('COMPUTE-TOKEN', this.authService.user.api_key);

    return this.delete(url, headers);
  }

  update(user: User): Promise<WPSResponse> {
    return this.postCSRF(this.configService.authUpdatePath, user.toUrlEncoded());
  }

  regenerateKey(): Promise<WPSResponse> {
    return this.getCSRF(this.configService.authUserRegenPath);
  }
}
