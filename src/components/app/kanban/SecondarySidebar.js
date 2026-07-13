import { Tabs, Tab, Row, Col, Nav, Image } from 'react-bootstrap';
import SvgIcon from './SvgIcon';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBreakpoints } from 'hooks/useBreakpoints';

const SecondarySidebar = ({isHold, activeSubMenu, onClose, isSidebarExpanded, active, onMouseLeave }) => {
  let statusClass = '';

  if (isSidebarExpanded || isHold) {
    if (active) {
      statusClass = 'show-active';
    } else {
      statusClass = 'show-standby';
    }
  }

  return (
    <div className={`secondary-sidebar-overlay bg-primary-light px-3 ${statusClass}`} onMouseLeave={onMouseLeave}>
      <div>
        <div className="d-lg-none cursor-pointer text-primary my-2 pt-1 d-flex align-items-center" onClick={onClose}>
          <SvgIcon name="chevron-down" size={20} style={{ rotate: '90deg' }} />
          <span className="ms-1 fs-10 m-0 fw-semibold font-sans-serif">Back</span>
        </div>
        {activeSubMenu?.Type == 'M' ? (
          <MenuGrid activeSubMenu={activeSubMenu} data={activeSubMenu} onClose={onClose} />
        ) : (
          <Tabs
            id="sub-menu-tabs"
            variant="pills"
            defaultActiveKey="transaction"
            className="custom-nav-tabs fs-11 fw-normal bg-primary-shadow mb-3 my-lg-3 nav-justified rounded-pill border-0 p-1 d-flex gap-2"
          >
            <Tab
              eventKey="transaction"
              title={
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <SvgIcon name="edit-2" size={14} />
                  <span>Transaction</span>
                </div>
              }
            >
              <MenuGrid activeSubMenu={activeSubMenu} data={activeSubMenu?.children?.find(i => i.MenuName === 'Transaction' || i.MenuName === 'Transaction ' || i.MenuName === 'Transaction  ')} />
            </Tab>
            <Tab
              eventKey="report"
              title={
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <SvgIcon name="file-text" size={14} />
                  <span>Report</span>
                </div>
              }
            >
              <MenuGrid activeSubMenu={activeSubMenu} data={activeSubMenu?.children?.find(i => i.MenuName === 'Report' || i.MenuName === 'Report ' || i.MenuName === 'Report  ')} />
            </Tab>
            <Tab
              eventKey="master"
              title={
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <SvgIcon name="settings" size={14} />
                  <span>Master</span>
                </div>
              }
            >
              <MenuGrid activeSubMenu={activeSubMenu} data={activeSubMenu?.children?.find(i => i.MenuName === 'Master' || i.MenuName === 'Master ' || i.MenuName === 'Master  ')} />
            </Tab>
          </Tabs>
        )}
      </div>
    </div>
  );
};

const MenuGrid = ({ data, activeSubMenu, onClose }) => {
  let { width, height, breakpoints } = useBreakpoints();
  let htab = height - 110;
  let htabe = height - 50;

  return (
    <div className="d-flex flex-column gap-3 pb-3 overflow-y-auto pe-3 me-n3" style={{ maxHeight: self == top ? htab + 48 : htabe + 48, overflowX: 'hidden' }}>
      {data?.Type == 'M' ? (
        <Row className="g-3 mt-1 mx-n2">
          {data?.children?.map((i, idx) => {
            let finalTo = '';
            const fullUrl = `${i.Url.replace(/^\//, '')}`;
            let type = data?.Type == 'M' ? 'MOBILE' : 'ERP';
            finalTo = i.Url.includes('aspx') ? `/login/iframe-viewer/${encodeURIComponent(fullUrl)}?type=${type}` : i.Url.startsWith('/') ? i.Url : `/${i.Url}`;
            return (
              <Col key={idx} xs={6} md={6} lg={4} className="text-center">
                <Nav.Link
                  as={i.Url.includes('http') ? 'a' : Link}
                  {...(i.Url.includes('http') ? { href: i.Url, target: '_blank', rel: 'noopener noreferrer' } : { to: finalTo })}
                  className="p-2 rounded cursor-pointer h-100 bg-white d-flex flex-column align-items-center justify-content-center gap-1"
                >
                  <Image src={i.Icon} width={32} />
                  {/* <SvgIcon name={i.icon} size={32} /> */}
                  <div className="text-black small lh-sm">{i.MenuName}</div>
                </Nav.Link>
              </Col>
            );
          })}
        </Row>
      ) : (
        <>
          {data?.children?.map((item, idx) => (
            <div key={idx}>
              <h6 className="m-0 mb-3 fw-semibold fs-10 text-black">{item?.MenuName}</h6>
              <Row className="g-3 mx-n2">
                {item?.children?.map((i, idx) => {
                  let finalTo = '';
                  const fullUrl = `${i.Url.replace(/^\//, '')}`;
                  let type = data.Type == 'M' ? 'MOBILE' : 'ERP';
                  finalTo = i.Url.includes('aspx') ? `/login/iframe-viewer/${encodeURIComponent(fullUrl)}?type=${type}` : i.Url.startsWith('/') ? i.Url : `/login/${i.Url}`;
                  return (
                    <Col key={idx} xs={6} md={6} lg={4} className="text-center">
                      <Nav.Link
                        as={i.Url.includes('http') ? 'a' : Link}
                        {...(i.Url.includes('http') ? { href: i.Url, target: '_blank', rel: 'noopener noreferrer' } : { to: finalTo })}
                        className="p-2 rounded cursor-pointer h-100 bg-white d-flex flex-column align-items-center justify-content-center gap-1"
                      >
                        <Image src={i.Icon} width={32} />
                        {/* <SvgIcon name={i.icon} size={32} /> */}
                        <div className="text-black small lh-sm">{i.MenuName}</div>
                      </Nav.Link>
                    </Col>
                  );
                })}
              </Row>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default SecondarySidebar;
