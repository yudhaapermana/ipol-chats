import { Accordion, Nav } from 'react-bootstrap';
import { RxCaretDown } from 'react-icons/rx';

const SidebarItem = ({ item, isExpanded }) => {
  const hasChildren = item.children && item.children.length > 0;

  // Jika Menu memiliki anak (Sub-menu)
  if (hasChildren) {
    return (
      <Accordion className="w-100 border-0 bg-transparent">
        <Accordion.Item eventKey="0" className="border-0 bg-transparent">
          <Accordion.Header className="sidebar-accordion-header p-0">
            <div className="d-flex w-100 align-items-center justify-content-between text-white py-2 px-1">
              <div className="d-flex align-items-center">
                <span className="fs-8 me-2">{item.icon}</span>
                {isExpanded && <span className="menu-text fs-10">{item.title}</span>}
              </div>
              {isExpanded && <RxCaretDown className="caret-icon fs-7" />}
            </div>
          </Accordion.Header>
          {isExpanded && (
            <Accordion.Body className="p-0 ps-3 border-start border-light border-opacity-25 ms-2">
              {item.children.map((child, idx) => (
                <SidebarItem key={idx} item={child} isExpanded={isExpanded} />
              ))}
            </Accordion.Body>
          )}
        </Accordion.Item>
      </Accordion>
    );
  }

  // Jika Menu tunggal (Link biasa)
  return (
    <Nav.Link href={item.path || "#"} className="text-white d-flex align-items-center py-2 px-1 w-100 nav-link-custom">
      <span className="fs-8 me-2">{item.icon || <div style={{width: '12px'}}/>}</span>
      {isExpanded && <span className="menu-text fs-10">{item.title}</span>}
    </Nav.Link>
  );
};

export default SidebarItem