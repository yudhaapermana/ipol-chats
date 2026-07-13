import React, { useEffect, useState } from 'react';
import logo from 'assets/img/logo/logo_new.png';
import { Accordion, Card, Col, Image, Row, useAccordionButton } from 'react-bootstrap';
import IconButtonNew from 'components/app/kanban/IconButtonNew';
import BtnMenu from 'components/navbar/headermenu/BtnMenu';
import { Link, useNavigate } from 'react-router-dom';
import { useBreakpoints } from 'hooks/useBreakpoints';
import SvgIcon from 'components/app/kanban/SvgIcon';
import { MdWebAssetOff } from 'react-icons/md';
import { RiEdgeNewFill } from 'react-icons/ri';
import blckfirefox1 from 'assets/img/content-blocking.width-800 1.svg';
import blckfirefox2 from 'assets/img/content-blocking-custom.width-800 1.svg';

const PopupBlocker = () => {
  const { width, height } = useBreakpoints();
  const [browser, setBrowser] = useState('Chrome');
  const navigate = useNavigate();

  let htab = height - 110;
  let htabe = height - 55;

  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey);

    return (
      <div className="cursor-pointer" onClick={decoratedOnClick}>
        {children}
      </div>
    );
  }

  useEffect(() => {
    const ua = navigator.userAgent;
    if (ua.includes('Edg/')) {
      setBrowser('Edge');
    } else if (ua.includes('Firefox/')) {
      setBrowser('Firefox');
    } else {
      setBrowser('Chrome');
    }
  }, []);

  const checkPopupBlocker = () => {    
    const popup = window.open("about:blank", "_blank", "width=1,height=1");

    try {
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {        
        return false;
      } else {        
        popup.close();
        return true;
      }
    } catch (e) {
      return false;
    }
  };

  const handleBack = () => {
    checkPopupBlocker();
    if (!checkPopupBlocker()) {      
      return
    } else {
      navigate('/');
    }
  }

  return (
    <>
      <div className="w-100 h-100 d-flex flex-column gap-3 vh-100 p-3">
        <Image src={logo} className="mx-auto" width={300} />
        <Row className="g-0 align-items-center">
          <Col className="col-12 col-sm-11">
            <h1 className="fw-bold fs-8 m-0">Block or allow pop-ups in {browser == 'Edge' ? 'Microsoft Edge' : browser == 'Firefox' ? 'Firefox' : 'Chrome'}</h1>
          </Col>
          <Col className="col-12 col-sm-1">
            <BtnMenu isIcon={true} icon={'logout'} title={'Back'} color="ms-auto bg-light text-info py-2" iconSize={16} evclick={handleBack}/>
          </Col>
        </Row>
        <Card>
          <Card.Body className="p-3 fs-10 m-0 d-flex flex-column gap-5 overflow-y-auto" style={{ maxHeight: self == top ? htab - 25 : htabe - 25 }}>
            {browser == 'Chrome' ? (
              <>
                <div className="lh-sm">
                  <p className="m-0">
                    By default, Google Chrome blocks pop-ups from automatically showing up on your screen. When a pop-up is blocked, the address bar will be marked Pop-up blocked . You can also decide
                    to allow pop-ups. <br /> If you still get pop-ups after disabling them:
                  </p>
                  <ul className="mb-0">
                    <li>
                      You may have previously subscribed to receive notifications from a site. You can block notifications if you don’t want any communications from a site to show up on your screen.{' '}
                      <Link to={'https://support.google.com/chrome/answer/3220216'} target="blank">
                         Learn how to manage your notifications.
                      </Link>
                    </li>
                    <li>
                      Your computer or phone may be infected by malware.{' '}
                      <Link to={'https://support.google.com/chrome/answer/2765944'} target="blank">
                         Learn how to get rid of malware.
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h6 className="fw-bold m-0 text-primary mb-3">Change your default pop-ups & redirects settings</h6>
                  <ol className="mb-0">
                    <li>
                      On your computer, open <strong>Chrome</strong>.
                    </li>
                    <li>
                      <div className="d-flex align-items-center gap-1">
                        At the top right, click More <SvgIcon size={16} name={'dot-vertical'} /> <SvgIcon size={16} name={'chevron-right'} /> <strong>Setting</strong>{' '}
                      </div>
                    </li>
                    <li>
                      <div className="d-flex align-items-center gap-1">
                        Click 
                        <strong>
                          Privacy and security <SvgIcon size={16} name={'chevron-right'} /> Site Settings <SvgIcon size={16} name={'chevron-right'} /> Pop-ups and redirects.
                        </strong>{' '}
                      </div>
                    </li>
                    <li>Choose the option that you want as your default setting.</li>
                  </ol>
                </div>
                <div>
                  <h6 className="fw-bold m-0 text-primary mb-3">Manage pop-ups & redirects for a specific site</h6>
                  <p className="m-0">Not all pop-ups are ads or spam. Some legitimate websites display web content in pop-up windows.</p>
                  <Row className="g-0">
                    <Col className="col-12 col-lg-5">
                      <Accordion alwaysOpen flush className="shadow-none">
                        <Accordion.Item eventKey="0" className="shadow-none border-1">
                          <CustomToggle eventKey={[0].toString()}>
                            <div className="d-flex align-items-center justify-content-between py-3">
                              <p className="m-0 text-primary">Change your default pop-ups & redirects settings</p>
                              <SvgIcon name="chevron-down" size={20} className="text-dark" />
                            </div>
                          </CustomToggle>
                          <Accordion.Body className="p-0 pb-3">
                            <ol className="mb-0">
                              <li>
                                On your computer, open <strong>Chrome</strong>.
                              </li>
                              <li>Go to a page where pop-ups are blocked.</li>
                              <li>
                                <div className="d-flex align-items-center gap-1">
                                  In the address bar, click Pop-up blocked <MdWebAssetOff size={18} />.
                                </div>
                              </li>
                              <li>Click the link for the pop-up you want to check.</li>
                              <li>
                                <div className="d-flex align-items-center gap-1">
                                  To always allow pop-ups for the site, select
                                  <strong className="text-primary"> Always allow pop-ups and redirects from [site]</strong> <SvgIcon size={16} name={'chevron-right'} /> <strong>Done</strong>.
                                </div>
                              </li>
                            </ol>
                          </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="1">
                          <CustomToggle eventKey={[1].toString()}>
                            <div className="d-flex align-items-center justify-content-between py-3">
                              <p className="m-0 text-primary">Block pop-ups and redirects from a site</p>
                              <SvgIcon name="chevron-down" size={20} className="text-dark" />
                            </div>
                          </CustomToggle>
                          <Accordion.Body className="p-0">
                            <ol className="mb-0">
                              <li>
                                On your computer, open <strong>Chrome</strong>.
                              </li>
                              <li>
                                <div className="d-flex align-items-center gap-1">
                                  At the top right, click More <SvgIcon size={16} name={'dot-vertical'} /> <SvgIcon size={16} name={'chevron-right'} /> <strong>Setting</strong>{' '}
                                </div>
                              </li>
                              <li>
                                <div className="d-flex align-items-center gap-1">
                                  Click 
                                  <strong>
                                    Privacy and security <SvgIcon size={16} name={'chevron-right'} /> Site Settings <SvgIcon size={16} name={'chevron-right'} /> Pop-ups and redirects.
                                  </strong>{' '}
                                </div>
                              </li>
                              <li>
                                Click <strong>Pop-ups and redirects.</strong>
                              </li>
                              <li>Under "Allowed to send pop-ups and use redirects," find the site.</li>
                              <li>
                                <div className="d-flex align-items-center gap-1">
                                  To the right of the site, click More <SvgIcon size={16} name={'dot-vertical'} /> <SvgIcon size={16} name={'chevron-right'} /> <strong>Block</strong>
                                </div>
                              </li>
                            </ol>
                            <p className="m-0">
                              If the site isn't listed, next to "Not allowed to send pop-ups or use redirects," click <strong>Add</strong> . Enter the site's web address, and then click 
                              <strong>Add</strong>. To capture all pop-ups across the site, use the pattern [*.]example.com.
                            </p>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </Col>
                  </Row>
                </div>
                <div>
                  <h6 className="fw-bold m-0 text-primary mb-3">Block notifications</h6>
                  <p className="m-0">If you still get communications from a site after disabling pop-ups, you may be subscribed to notifications. To turn off notifications for a site:</p>
                  <ol className="mb-0">
                    <li>
                      On your computer, open <strong>Chrome</strong>.
                    </li>
                    <li>Go to the site you get notifications from.</li>
                    <li>
                      <div className="d-flex align-items-center gap-1">
                        Click View site information
                        <SvgIcon size={16} name={'lock-01'} />
                      </div>
                    </li>
                    <li>
                      Next to "Notifications," select  <strong>Block</strong> from the drop down menu.
                    </li>
                  </ol>
                  <p className="m-0">You can also block notifications from your site settings.</p>
                </div>
                <div>
                  <h6 className="fw-bold m-0 text-primary mb-3">Review removed notifications</h6>
                  <p className="m-0">
                    To prevent notification overload, Chrome may remove notification permission from sites that you haven't visited in a while. When permissions are removed, you'll get an alert that
                    you won't receive any notifications from these sites.
                  </p>
                  <p className="m-0">If you want to receive notifications from a site again, you can change its permissions in Settings.</p>
                  <ol className="mb-0">
                    <li>
                      On your computer, open <strong>Chrome</strong>.
                    </li>
                    <li>
                      <div className="d-flex align-items-center gap-1">
                        At the top right, click More <SvgIcon size={16} name={'dot-vertical'} /> <SvgIcon size={16} name={'chevron-right'} /> <strong>Setting</strong>{' '}
                      </div>
                      <ul style={{ listStyleType: 'disc' }}>
                        <li>
                          You can also select <strong>Removed permissions from [n] unused sites </strong>.
                        </li>
                      </ul>
                    </li>
                    <li>
                      On the left, select <strong> Privacy and security </strong>.
                    </li>
                    <li>
                      Under “Safety Check,” select <strong> Go to Safety Check </strong>.
                    </li>
                    <li>Under “Safety recommendations,” you can find “Permissions removed for [n] sites.”</li>
                  </ol>
                  <p className="m-0">
                    <strong>Tip</strong>: You can also go directly to a site to re-grant notification permissions.
                  </p>
                </div>
                <div>
                  <h6 className="fw-bold m-0 text-primary mb-3">Problems with pop-ups</h6>
                  <p className="m-0">
                    <strong>Using a Chrome device at work or school</strong>: You can't change this setting yourself, but your network administrator can set up the pop-up blocker for you.{' '}
                    <Link to={'https://support.google.com/chromebook/answer/1331549'} target="blank">
                       Learn how to use a managed Chrome device.
                    </Link>
                  </p>
                  <p className="m-0">
                    You can control specific ways a website acts when you use Chrome.{' '}
                    <Link to={'https://support.google.com/chrome/answer/114662'} target="blank">
                       Learn how to set permissions in Chrome.
                    </Link>
                  </p>
                </div>
                <div>
                  <h6 className="fw-bold m-0 text-primary mb-3">My site's popups are being blocked</h6>
                  <p className="m-0">Chrome blocks pop-ups that users might not find useful.</p>
                  <p className="m-0">
                    If pop-ups get blocked on a site that you own, go to the 
                    <Link to={'https://support.google.com/webtools/answer/7539006'} target="blank">
                      Abusive Experience Report
                    </Link>
                    {'. '}
                    In the report, you can learn if there are any issues found with your site that you can address.
                  </p>
                </div>
                <div>
                  <h6 className="fw-bold m-0 text-primary mb-3">Related resources</h6>
                  <ul className="mb-0">
                    <li>
                      <Link to={'https://support.google.com/chrome/answer/3220216'} target="blank">
                        Use notifications to get alerts
                      </Link>
                    </li>
                    <li>
                      <Link to={'https://support.google.com/chrome/answer/2765944'} target="blank">
                        Remove unwanted ads, pop-ups & malware
                      </Link>
                    </li>
                  </ul>
                </div>
              </>
            ) : browser == 'Edge' ? (
              <>
                <div className="lh-sm">
                  <p className="m-0">
                    The Microsoft Edge <RiEdgeNewFill size={18} /> feature that blocks pop-ups is effective in preventing websites from automatically opening a new window or tab, or a partial window
                    on top of your current web page. This feature is turned on by default. 
                    <br /> There are many different types of pop-ups, including advertisements, notices, offers, or alerts that can appear at various times on any web page. Some can be helpful, such
                    as when a bank website displays your monthly statement in a pop-up window. Pop-ups can also be distracting or malicious, engaging in phishing tactics such as warnings, prizes, or
                    free downloads, to gain your trust in a potential scam.   
                  </p>
                </div>
                <div className="p-3 bg-200">
                  <p className="m-0">
                    Note: If you are receiving unwanted website notifications, please see 
                    <Link to={'https://support.microsoft.com/en-us/microsoft-edge/manage-website-notifications-in-microsoft-edge-0c555609-5bf2-479d-a59d-fb30a0b80b2b'} target="blank">
                      Manage website notifications in Microsoft Edge
                    </Link>
                    . Website notifications appear in the notification center, located in the lower right corner of your device.
                  </p>
                </div>
                <div>
                  <p className="fw-bold m-0 text-primary mb-3">How to block pop-ups in Microsoft Edge</p>
                  <ol className="mb-0">
                    <li>
                      <div className="d-flex align-items-center gap-1">
                        In Edge, go to <strong>Settings and more</strong> <SvgIcon size={16} name={'dot-vertical'} style={{ rotate: '90deg' }} /> at the top of your browser. 
                      </div>
                    </li>
                    <li>
                      <div className="d-flex align-items-center gap-1">
                        Select <strong>Settings</strong> <SvgIcon name={'settings'} size={16} /> <SvgIcon name={'chevron-right'} size={16} /> <strong>Privacy, search, and services</strong>{' '}
                        <SvgIcon name={'lock-01'} size={16} />
                      </div>
                    </li>
                    <li>
                      <div className="d-flex align-items-center">
                        Select <strong> Site permissions</strong>  <SvgIcon name={'chevron-right'} size={16} /> <strong>All permissions</strong>.
                      </div>
                    </li>
                    <li>
                      Select <strong>Pop-ups and redirects</strong> and go to <strong>Allowed to send pop-ups and use redirects</strong>.
                    </li>
                    <li>
                      Select <strong>Add site</strong> and type in the URL that you want to allow to create pop-ups into the dialog box (starting with the <strong>https</strong>:// portion at the
                      beginning) and select <strong>Add</strong>. The URL should now appear in your Allow list.
                    </li>
                  </ol>
                </div>
                <div>
                  <p className="fw-bold m-0 text-primary mb-3">What to do if you still see pop-ups</p>
                  <p className="m-0 mb-2">If you continue to receive pop-ups after turning this feature on, try the following solutions:</p>
                  <ul className="mb-0">
                    <li>
                      <div className="d-flex align-items-center gap-1">
                        Make sure Edge is up to date: Select Settings and more <SvgIcon name={'dot-vertical'} style={{ rotate: '90deg' }} size={16} /> <SvgIcon size={16} name={'chevron-right'} />
                        <strong>Settings</strong> <SvgIcon name={'settings'} size={16} /> About Microsoft Edge <RiEdgeNewFill size={18} /> If there is an update available, you can apply it from here.
                      </div>
                    </li>
                    <li>
                      <strong>Scan your device for malware</strong>
                      :For more, see 
                      <Link to={'https://support.microsoft.com/en-us/windows/stay-protected-with-the-windows-security-app-2ae0363d-0ada-c064-8b56-6a39afb6a963'} target="blank">
                        Stay protected with Windows Security
                      </Link>
                      .
                    </li>
                    <li>
                      <div className="d-flex align-items-center gap-1">
                        <strong>Disable your extensions</strong>: Check if an extension is interfering. <strong>Select Settings and more</strong>{' '}
                        <SvgIcon name={'dot-vertical'} style={{ rotate: '90deg' }} size={16} /> <SvgIcon size={16} name={'chevron-right'} />
                        <strong>Extensions</strong> <SvgIcon size={16} name={'chevron-right'} />
                        <strong>Manage extension</strong>, then turn each extension off.
                      </div>
                      <p className="m-0">If pop-ups are now being blocked, turn on extensions one at a time to determine which one is causing the issue.</p>
                    </li>
                    <li>
                      <div className="d-flex align-items-center gap-1">
                        <strong>Block third-party cookies Settings and more</strong>:To do this, select <strong>Settings and more</strong>{' '}
                        <SvgIcon name={'dot-vertical'} style={{ rotate: '90deg' }} size={16} /> <SvgIcon size={16} name={'chevron-right'} /> <strong>Settings</strong>{' '}
                        <SvgIcon name={'settings'} size={16} /> <SvgIcon size={16} name={'chevron-right'} />
                        <strong>Privacy, search, and services</strong> <SvgIcon size={16} name={'lock-01'} /> <SvgIcon size={16} name={'chevron-right'} /> <strong>Cookies</strong> and turn on{' '}
                        <strong> Block third-party cookies.</strong>
                      </div>
                    </li>
                    <li>
                      <strong>Clear your browser cache</strong>: For more, see 
                      <Link to={'https://support.microsoft.com/en-us/microsoft-edge/view-and-delete-browser-history-in-microsoft-edge-00cf7943-a9e1-975a-a33d-ac10ce454ca4'} target="blank">
                        View and delete browser history in Microsoft Edge
                      </Link>
                      .
                    </li>
                  </ul>
                </div>
                <div className="lh-sm d-flex flex-column gap-3">
                  <p className="m-0 text-primary fw-bold">What cannot be blocked by the pop-up blocker?  </p>
                  <p className="m-0">
                    If you still see pop-ups within a web page once this feature is turned on and you have tried the solutions listed above, they may be website advertisements created to look like
                    pop-ups. Website advertisements cannot be blocked by the Edge pop-up blocker. Edge also does not prevent a pop-up from opening if you select a button or link on a web page.  
                  </p>
                  <div className="p-3 bg-200">
                    <p className="m-0">
                      Note: This topic is for the new Microsoft Edge <RiEdgeNewFill size={18} />. Get help for{' '}
                      <Link to={'https://support.microsoft.com/microsoft-edge-legacy'} target="blank">
                        the legacy version of Microsoft Edge
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="d-flex flex-column gap-3">
                  <p className="fw-bold m-0 text-primary">Change your default pop-ups & redirects settings</p>
                  <p className="m-0">
                    There are many ad-blocking tools to explore, each offering features to suit different preferences. Finding the right one for you depends on your desires and browsing habits. Here
                    are a few tips to consider:
                  </p>
                  <ul className="mb-0">
                    <li>
                      <strong>Blocking Ads</strong>: If you only want to block ads, choose a simple and lightweight option.
                    </li>
                    <li>
                      <strong>Privacy Concerns</strong>: If you're worried about trackers, look for an ad blocker with built-in privacy features.
                    </li>
                    <li>
                      <strong>Customizability</strong>: Some ad blockers allow fine-tuning to whitelist specific sites or block specific elements.
                    </li>
                    <li>
                      <strong>Device Compatibility</strong>: Consider whether you need it for desktop, mobile, or both.
                    </li>
                    <li>
                      <strong>Malware Blocking</strong>: Some ad blockers protect against malicious ads (e.g., AdGuard).
                    </li>
                    <li>
                      <strong>Parental Controls</strong>: Useful if you want to block inappropriate content.
                    </li>
                  </ul>
                  <p className="m-0">
                    It's important to note that some websites rely on ads to load content or provide functionality. Blocking ads may cause features to break, such as videos not playing or login
                    options failing. Choose an ad blocker that is updated regularly and if you find one ad blocker causes significant issues, try another to find a better balance of performance and
                    compatibility.
                  </p>
                </div>
                <div className="d-flex flex-column gap-3">
                  <p className="fw-bold m-0 text-primary">Enhanced Privacy and Performance with Firefox</p>
                  <p className="m-0">
                    Beyond ad blockers, Firefox includes built-in features to give you even greater control over your browsing. These tools help protect your privacy while allowing you to customize your experience:
                  </p>
                  <ul className="mb-0">
                    <li>
                      <strong>Standard Mode</strong>: A balanced option that blocks common trackers while maintaining smooth website functionality.
                    </li>
                    <li>
                      <strong>Strict Mode</strong>: Ideal for users who want stronger privacy protection by blocking more trackers and cookies. Note that some sites may require adjustments in this mode.
                    </li>
                    <li>
                      <strong>Custom Mode</strong>: For those who want full control, Custom mode lets you select what to block, from cookies to trackers and more.
                    </li>                   
                  </ul>
                  <p className="m-0">
                    To adjust these settings, click the shield icon to the left of the address bar on any webpage and select "Protection Settings." This will open a menu where you can choose the right level of protection for you.
                  </p>
                </div>
                <Image src={blckfirefox1} fluid className='mx-auto' width={700}/>
                <Image src={blckfirefox2} fluid className='mx-auto mb-2' width={700}/>
              </>
            )}
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default PopupBlocker;
