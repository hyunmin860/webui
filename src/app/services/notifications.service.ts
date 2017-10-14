import { Injectable, OnInit } from '@angular/core';
import { RestService } from 'app/services';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';


export interface NotificationAlert {
  id: string;
  message: string;
  icon: string;
  time: string;
  route: string;
  color: string;
  dismissed: boolean;
}


@Injectable()
export class NotificationsService {

  source: Observable<any>;
  intervalPeriod = 8000;
  interval;
  notifications: NotificationAlert[] = [];
  running = false;

  constructor(private restService: RestService) {

    this.initMe();

  }

  initMe(): void {

  
    this.source = Observable.create((observer) => {
      this.restService.get("system/alert", {}).subscribe((res) => {
        this.notifications = this.alertsArrivedHandler(res);
        observer.next(this.notifications);
        //observer.complete();
      });


      this.interval = setInterval(() => {
        
        if (this.running === false) {
          this.running = true;

          this.restService.get("system/alert", {}).subscribe((res) => {
            this.notifications = this.alertsArrivedHandler(res);
            observer.next(this.notifications);
            //observer.complete();
            this.running = false;
            console.log("got data from rest notificationAlerts");
          });
        } else {
          observer.next(this.notifications);
          //observer.complete();

          console.log("got data from cache rest busy now notificationAlerts");
        }
      }, this.intervalPeriod);

    });


  }

  public getNotifications(): Observable<any> {
    return this.source;
  }

  public getNotificationList(): NotificationAlert[] {
    return this.notifications;
  }

  public clearNotifications(notifications: Array<NotificationAlert>, dismissedFlag: boolean) {
    const oldNotifications = new Array<NotificationAlert>();
    notifications.forEach((notification) => {
      oldNotifications.push(notification);
    });

    oldNotifications.forEach((notification) => {
      notification.dismissed = dismissedFlag;
      this.restService.put("system/alert/" + notification.id + "/dismiss/", { body: dismissedFlag }).subscribe((res) => {
        console.log("alert dismissed id:" + notification.id);
      });

    });
  }

  /**
  * Takes incomming JSON REST message from system/alert rest api
  * res.data  array where each element looks like:
  *  {"dismissed":false,
  *   "id":"d90e9594a20cba9660003a55c3f51a6c",
  *   "level":"WARN",
  *   "message":"smartd is not running.\n",
  *   "timestamp":1504725447}
  */
  private alertsArrivedHandler(res): NotificationAlert[] {
    const returnAlerts = new Array<NotificationAlert>();
    const data: Array<any> = res.data;

    data.forEach((alertObj: NotificationAlert) => {

      returnAlerts.push(this.addNotification(alertObj));

    });

    return returnAlerts;
  }

  /**
  * Returns the hours/mintues am/pm part of the date.
  */
  private getTimeAsString(timestamp: number) {
    const d: Date = new Date(timestamp);
    d.setHours(d.getHours() + 2); // offset from local time
    const h = (d.getHours() % 12) || 12; // show midnight & noon as 12
    return (
      (h < 10 ? '0' : '') + h +
      (d.getMinutes() < 10 ? ':0' : ':') + d.getMinutes() +
      // optional seconds display
      // ( d.getSeconds() < 10 ? ':0' : ':') + d.getSeconds() + 
      (d.getHours() < 12 ? ' AM' : ' PM')
    );

  }

  private addNotification(alertObj): NotificationAlert {
    const id: string = alertObj.id;
    const dismissed: boolean = alertObj.dismissed;
    const message: string = <string>alertObj.message;
    const level: string = <string>alertObj.level;
    const timestamp: number = <number>alertObj.timestamp * 1000; // unix timestamp in seconds
    // javascript in milli
    const date: Date = new Date(timestamp);
    const dateStr = date.toDateString() + " " + this.getTimeAsString(date.getTime());
    const routeName = "/dashboard"
    let icon = "info";
    let color = "primary";

    if (level === "WARN") {
      icon = "watch_later";
      color = "warn";
    } else if (level === 'ERROR') {
      icon = "error";
      color = "warn";
    }

    const newNotification: NotificationAlert = {
      id: id,
      message: message,
      icon: icon,
      time: dateStr,
      route: routeName,
      color: color,
      dismissed: dismissed
    };

    return newNotification;
  }

}
