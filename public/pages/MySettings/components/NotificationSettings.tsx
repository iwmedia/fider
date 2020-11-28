import React, { useState } from "react";

import { UserSettings } from "@fider/models";
import { Toggle, Segment, Segments, Field } from "@fider/components";
import { useFider } from "@fider/hooks";

interface NotificationSettingsProps {
  userSettings: UserSettings;
  settingsChanged: (settings: UserSettings) => void;
}

type Channel = number;
const WebChannel: Channel = 1;
const EmailChannel: Channel = 2;

export const NotificationSettings = (props: NotificationSettingsProps) => {
  const fider = useFider();
  const [userSettings, setUserSettings] = useState(props.userSettings);

  const isEnabled = (settingsKey: string, channel: Channel): boolean => {
    if (settingsKey in userSettings) {
      return (parseInt(userSettings[settingsKey], 10) & channel) > 0;
    }
    return false;
  };

  const toggle = async (settingsKey: string, channel: Channel) => {
    const nextSettings = {
      ...userSettings,
      [settingsKey]: (parseInt(userSettings[settingsKey], 10) ^ channel).toString()
    };
    setUserSettings(nextSettings);
    props.settingsChanged(nextSettings);
  };

  const icon = (settingsKey: string, channel: Channel) => {
    const active = isEnabled(settingsKey, channel);
    const label = channel === WebChannel ? "Web" : "Email";
    const onToggle = () => toggle(settingsKey, channel);
    return <Toggle key={`${settingsKey}_${channel}`} active={active} label={label} onToggle={onToggle} />;
  };

  const info = (settingsKey: string, aboutForVisitors: string, aboutForCollaborators: string) => {
    const about = fider.session.user.isCollaborator ? aboutForCollaborators : aboutForVisitors;
    const webEnabled = isEnabled(settingsKey, WebChannel);
    const emailEnabled = isEnabled(settingsKey, EmailChannel);

    if (!webEnabled && !emailEnabled) {
      return (
        <p className="info">
          Du erhältst <strong>KEINE</strong> Benachrichtigungen über dieses Ereignis.
        </p>
      );
    } else if (webEnabled && !emailEnabled) {
      return (
        <p className="info">
          Du erhältst <strong>web</strong> Benachrichtigungen über {about}.
        </p>
      );
    } else if (!webEnabled && emailEnabled) {
      return (
        <p className="info">
           Du erhältst <strong>E-Mail</strong> Benachrichtigungen über {about}.
        </p>
      );
    } else if (webEnabled && emailEnabled) {
      return (
        <p className="info">
          Du erhältst <strong>web</strong> und <strong>E-Mail</strong> Benachrichtigungen über  {about}.
        </p>
      );
    }
    return null;
  };

  return (
    <>
      <Field label="Notifications">
        <p className="info">Verwenden Sie das folgende Fenster, um auszuwählen, welche Ereignisse Sie benachrichtigen möchten</p>
      </Field>

      <div className="notifications-settings">
        <Segments>
          <Segment>
            <span className="event-title">Neuer Beitrag</span>
            {info("event_notification_new_post", "new posts on this site", "new posts on this site")}
            <p>
              {icon("event_notification_new_post", WebChannel)}
              {icon("event_notification_new_post", EmailChannel)}
            </p>
          </Segment>
          <Segment>
            <span className="event-title">Diskussion</span>
            {info(
              "event_notification_new_comment",
              "comments on posts you've subscribed to",
              "comments on all posts unless individually unsubscribed"
            )}
            <p>
              {icon("event_notification_new_comment", WebChannel)}
              {icon("event_notification_new_comment", EmailChannel)}
            </p>
          </Segment>
          <Segment>
            <span className="event-title">Status geändert</span>
            {info(
              "event_notification_change_status",
              "status change on posts you've subscribed to",
              "status change on all posts unless individually unsubscribed"
            )}
            <p>
              {icon("event_notification_change_status", WebChannel)}
              {icon("event_notification_change_status", EmailChannel)}
            </p>
          </Segment>
        </Segments>
      </div>
    </>
  );
};
