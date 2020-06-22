import React, {useState} from "react";
import {Header} from '../components/drawer_and_header/header';
import {BlackDrawer} from '../components/drawer_and_header/black_drawer';
import {EngagementNavigation} from '../components/drawer_and_header/engagement_navigation';
import {Drawer, DrawerContent, Page,} from '@patternfly/react-core';
import {NotificationContent} from "../components/drawer_and_header/notification_content";
import { useNotification } from '../context/notification_context/notification_context';

export interface MainTemplateProps {
  children: React.ReactChild;
}

export const MainTemplate = (props: MainTemplateProps) => {

  const { notification } = useNotification();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
  const [isNotificationExpanded, setIsNotificationExpanded] = useState(false);

  const onNavToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const onClick = () => {
    setIsNotificationExpanded(!isNotificationExpanded);
  };

  const onClose = () => {
    setIsNotificationExpanded(false);
  };

  return (
    <Page header={<Header isDrawerOpen={isDrawerOpen}
                          onNavToggle={onNavToggle}
                          onNotificationClick={onClick}
    />}
          style={{height: '100vh'}}
          sidebar={
            <BlackDrawer isDrawerOpen={isDrawerOpen}>
              <EngagementNavigation/>
            </BlackDrawer>
          }>
      <Drawer isExpanded={isNotificationExpanded}>
        <DrawerContent panelContent={
          <NotificationContent onClose={onClose}
                               notification={notification}/>}>
          {props.children}
        </DrawerContent>
      </Drawer>
    </Page>
  );
};
