import {ApplicationRef, Component, Injector, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import * as _ from 'lodash';
import {Subscription} from 'rxjs';

import {RestService, WebSocketService} from '../../../../services/';
import {
  FieldConfig
} from '../../../common/entity/entity-form/models/field-config.interface';
import {
  matchOtherValidator
} from '../../../common/entity/entity-form/validators/password-validation';
import { T } from '../../../../translate-marker';

@Component({
  selector : 'dynamicdns-edit',
  template : `<entity-form [conf]="this"></entity-form>`
})

export class ServiceDDNSComponent {
  protected resource_name: string = 'services/dynamicdns';
  protected route_success: string[] = [ 'services' ];

  public fieldConfig: FieldConfig[] = [
    {
      type : 'select',
      name : 'ddns_provider',
      placeholder : T('Provider'),
      tooltip: T('Several providers are supported. If your provider is\
       not listed, select <i>Custom Provider</i> and enter the information in\
       the <i>Custom Server</i> and <i>Custom Path</i> fields.'),
      options : [
        {label : 'dyndns.org', value : 'dyndns@dyndns.org'},
        {label : 'freedns.afraid.org', value : 'default@freedns.afraid.org'},
        {label : 'zoneedit.com', value : 'default@zoneedit.com'},
        {label : 'no-ip.com', value : 'default@no-ip.com'},
        {label : 'easydns.com', value : 'default@easydns.com'},
        {label : '3322.org', value : 'dyndns@3322.org'},
        {label : 'sitelutions.com', value : 'default@sitelutions.com'},
        {label : 'dnsomatic.com', value : 'default@dnsomatic.com'},
        {label : 'he.net', value : 'default@he.net'},
        {label : 'tzo.com', value : 'default@tzo.com'},
        {label : 'dynsip.org', value : 'default@dynsip.org'},
        {label : 'dhis.org', value : 'default@dhis.org'},
        {label : 'majimoto.net', value : 'default@majimoto.net'},
        {label : 'zerigo', value : 'default@zerigo.com'},
      ]
    },
    {
      type : 'input',
      name : 'ddns_ipserver',
      placeholder : T('IP Server'),
      tooltip: T('Enter the name and port of the server that reports the\
       external IP address in the format <i>server.name.org:port</i>.'),
    },
    {
      type : 'input',
      name : 'ddns_domain',
      placeholder : T('Domain name'),
      tooltip: T('Fully qualified domain name (e.g.\
       <i>yourname.dyndns.org</i>).'),
    },
    {
      type : 'input',
      name : 'username',
      placeholder : T('Username'),
      tooltip: T(''),
      required: true

    },
    {
      type : 'input',
      name : 'ddns_password',
      placeholder : T('Password'),
      tooltip: T('Password used to logon to the provider and update the\
       record.'),
      inputType : 'password',
      validation :

          [ Validators.minLength(8), matchOtherValidator('password2'), Validators.required ],
      required: true
    },
    {
      type : 'input',
      name : 'ddns_password2',
      placeholder : T('Confirm Password'),
      inputType : 'password',
      required: true
    },
    {
      type : 'input',
      name : 'ddns_updateperiod',
      placeholder : T('Update Period'),
      tooltip: T('How often the IP is checked in seconds.'),
    },
    {
      type : 'input',
      name : 'ddns_fupdateperiod',
      placeholder : T('Forced Update Period'),
      tooltip : T('Not recommended. Enter an interval in seconds for the\
       system to force IP updates.'),
    },
    {
      type : 'input',
      name : 'lldp_location',
      placeholder : T('Auxiliary Parameters'),
      tooltip : T('Enter any additional parameters to pass to the provider\
       during a record update.'),
    },
  ];

  constructor(protected router: Router, protected route: ActivatedRoute,
              protected rest: RestService, protected ws: WebSocketService,
              protected _injector: Injector, protected _appRef: ApplicationRef,
              ) {}

  afterInit(entityEdit: any) { }
}
