import React from 'react';
import { Badge, Nav, Tabs, Tab } from 'react-bootstrap';

const IsiTabs = ({ listTabs, idActiveTab, parentFunction, parentselected }) => {
  return (
    <>
      <Tab.Container
        defaultActiveKey={idActiveTab}
        mountOnEnter={true}
        onClick={k => {
          parentFunction(k);
        }}
        onSelect={parentselected}
      >
        <Nav variant="tabs" style={{ overflowX: 'auto', overflowY: 'hidden' }} className=" d-flex flex-nowrap flex-row mt-2">
          {listTabs.map(e => {
            return (
              <Nav.Item className="d-flex  flex-column">
                <Nav.Link eventKey={e.Id} style={{ width: 'max-content' }}>
                  {e.Text}
                  {e.badge
                    ? e.badge.map(badge => (
                        <Badge bg={badge.type} className="ms-2">
                          {badge.text}
                        </Badge>
                      ))
                    : ''}
                </Nav.Link>
              </Nav.Item>
            );
          })}
        </Nav>
        <Tab.Content className="d-flex flex-column flex-grow-1">
          {listTabs.map(e => {
            return (
              <Tab.Pane unmountOnExit eventKey={e.Id} className={`d-flex flex-column flex-grow-1`}>
                {e.TabPanel}
              </Tab.Pane>
            );
          })}
        </Tab.Content>
      </Tab.Container>
    </>
  );
};
export default IsiTabs;
