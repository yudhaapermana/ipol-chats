import React, { useState, useEffect, useRef } from 'react';
import { ListGroup, Form, Spinner } from 'react-bootstrap';
import * as ISI from 'script/ISI.js?2';
import '../../../src/css/OCCBigMachine.css';
import mqtt from 'mqtt';
import { CountUp, useCountUp } from 'react-countup';
import { Odometer } from 'odometer_countup';

const setFS = (fsize, percentage) => {
  switch (fsize) {
    case '15':
      return (0.2 * percentage) / 100 + 'rem';
    case '12':
      return (0.4944444444 * percentage) / 100 + 'rem';
    case '11':
      return (0.6944444444 * percentage) / 100 + 'rem';
    case '10':
      return (0.8333333333 * percentage) / 100 + 'rem';
    case '9':
      return (1 * percentage) / 100 + 'rem';
    case '8':
      return (1.2 * percentage) / 100 + 'rem';
    case '7':
      return (1.44 * percentage) / 100 + 'rem';
    case '6':
      return (1.728 * percentage) / 100 + 'rem';
    case '5':
      return (2.0736 * percentage) / 100 + 'rem';
    case '4':
      return (2.48832 * percentage) / 100 + 'rem';
    case '3':
      return (2.985984 * percentage) / 100 + 'rem';
    case '2':
      return (3.5831808 * percentage) / 100 + 'rem';
    case '1':
      return (4.29981696 * percentage) / 100 + 'rem';
    default:
      return '';
  }
};

const OCCBigMachine = ({ className, lgdata, Mch, Obj, SetObj, Height, Width, isfull, Prctg, MtFooter, parentclick }) => {
  let percentage = Prctg ? Prctg : 100;
  let mtfooter = MtFooter ? MtFooter : 0;

  // RunMeter
  // StsMachine (Hour, Minute, Second)
  // const hght = 25;

  const [Refresh, setRefresh] = useState(false);
  const [RefreshData, setRefreshData] = useState(false);
  const [RefreshCount, setRefreshCount] = useState(false);
  const [Countupppp, setCountupppp] = useState(0);

  const [TopicMQTT, setTopicMQTT] = useState([]);
  const [ClientOEE, setClientOEE] = useState(null);

  useEffect(() => {
    let tpc = [];
    tpc.push('UTILITY_GENERAL');
    tpc.push('SPEED');
    tpc.push('MQTT_DataLake');
    if (Mch == 'OPP1') tpc.push('BOPP1/mes_data');
    else if (Mch == 'OPP2') tpc.push('BOPP2/mes_data');
    else if (Mch == 'OPP3') tpc.push('BOPP3/mes_data');
    else if (Mch == 'PET') tpc.push('BOPET/mes_data');

    setTopicMQTT(tpc);
    setRefresh(true);
    // console.log('useEffect', tpc);
    setInterval(() => {
      IntTimer();
    }, 1000);
  }, []);

  const IntTimer = () => {
    if (Obj?.StsMachine?.DateStatus) {
      let countDownDate = Obj?.StsMachine?.DateStatus;
      countDownDate = new Date(countDownDate);
      let now = new Date().getTime();

      let distance = now - countDownDate.getTime();

      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);
      let dtObj = Obj;
      dtObj.StsMachine.StatusDays = days;
      dtObj.StsMachine.StatusHour = hours;
      dtObj.StsMachine.StatusMinutes = minutes;
      dtObj.StsMachine.StatusSecond = seconds;
      SetObj(dtObj);
      setRefreshData(true);
    }
  };
  useEffect(() => {
    // console.log('Refreshz', TopicMQTT);
    if (TopicMQTT.length > 0) {
      getMQTT(TopicMQTT);
    }
  }, [Refresh]);

  const getMQTT = lsttopic => {
    let connectUrl = '';
    let pr = 0;
    if (window.location.protocol == 'https:') {
      connectUrl = 'wss://mqtt.indopoly.co.id:8084/mqtt';
      pr = 8084;
    } else {
      connectUrl = 'ws://mqtt.indopoly.co.id:8083/mqtt';
      pr = 8083;
    }

    if (ClientOEE) {
      let xx = ClientOEE;
      // ClientOEE.disconnect();
      // console.log('xxx', xx);
    }
    let clnt = 'OCCREACT_' + lgdata.IP + '_' + Mch + (isfull ? '_FULL' : '');
    console.log('clnt', clnt);

    let clntoee = mqtt.connect(connectUrl, {
      keepalive: 60,
      clientId: clnt,
      connectTimeout: 5000,
      hostname: 'mqtt.indopoly.co.id',
      port: pr,
      path: '/mqtt'
    });

    clntoee.on('error', err => {
      // console.log('Connection error: ', err);
    });

    clntoee.on('reconnect', () => {
      // console.log('Reconnecting...');
    });

    clntoee.on('connect', () => {
      // console.log('Clientoee connected:');
      let qos = 0;
      lsttopic.map(x => {
        clntoee.subscribe(x, { qos }, error => {
          if (error) {
            console.log('Subscribe error:', error + ` ${x}`);
            return;
          }
          // console.log(`Subscribe to topic ${x}`);
        });
      });
    });

    clntoee.on('message', (topic, payload) => {
      var data = payload.toString().replaceAll("'", '"');
      if (payload.toString() != '') {
        var dt = '';
        try {
          if (data != 'None') dt = JSON.parse(data);
        } catch (error) {}

        ProcessDataMQTT(topic, dt);
      }
    });
    setClientOEE(clntoee);
  };

  const ProcessDataMQTT = (topic, dt) => {
    if (topic == 'UTILITY_GENERAL') {
      let id = Mch;
      if (dt.Mesin == id) {
        let dtObj = Obj;
        dtObj.StsMachine = {};
        dtObj.StsMachine.RunMeter = 0;
        dtObj.StsMachine.DateStatus = new Date();
        dtObj.StsMachine.Class = '';
        dtObj.StsMachine.StateVal = '';
        dtObj.StsMachine.StateCss = '';
        dtObj.StsMachine.StateOpacity = '0';
        dtObj.StsMachine.WarnClass = '1';
        dtObj.StsMachine.WarnOpacity = '1';

        if (dt.MachineStatus == 'Production' || dt.MachineStatus == 'True') {
          dtObj.StsMachine.Class = 'start';

          if (id.substring(0, 2) != '500') {
            Obj.Class = 'bgstart';
            dtObj.StsMachine.StateVal = dt.MachineStatus.toUpperCase();
            dtObj.StsMachine.StateCss = '#00ff00';
          }
        } else if (dt.MachineStatus == 'Shutdown' || dt.MachineStatus == 'False') {
          dtObj.StsMachine.Class = 'stop';
          if (id.substring(0, 2) != '500') {
            Obj.Class = 'bgstop';
            dtObj.StsMachine.StateVal = dt.MachineStatus.toUpperCase();
            dtObj.StsMachine.StateCss = '#E63757';
            dtObj.StsMachine.WarnOpacity = '0';
          }
        } else if (dt.MachineStatus == 'Filmbreak') {
          dtObj.StsMachine.Class = 'stop yellow';
          Obj.Class = 'bgstop';
          dtObj.StsMachine.StateVal = dt.MachineStatus.toUpperCase();
          dtObj.StsMachine.StateCss = '#fcdb03';
        } else if (dt.MachineStatus == 'Startup') {
          if (dt.Mode == 'chillroll thread' || dt.Mode == 'mdo thread' || dt.Mode == 'tdo thread') {
            dtObj.StsMachine.Class = 'stop';
            Obj.Class = 'bgstop';
            dtObj.StsMachine.StateVal = dt.Mode.toUpperCase();
            dtObj.StsMachine.StateCss = '#E63757';
          } else if (dt.Mode == 'tdo speedup' || dt.Mode == 'pullroll thread' || dt.Mode == 'pullroll speedup') {
            dtObj.StsMachine.Class = 'yellow';
            Obj.Class = 'bgstop';
            dtObj.StsMachine.StateVal = dt.Mode.toUpperCase();
            dtObj.StsMachine.StateCss = '#fcdb03';
          }
        } else if (dt.MachineStatus == 'Cleaning' || dt.MachineStatus == 'Ganti Program') {
          dtObj.StsMachine.Class = 'yellow';
          Obj.Class = 'bgstop';
          dtObj.StsMachine.StateVal = dt.MachineStatus.toUpperCase();
        } else if (dt.MachineStatus == 'Maintenance') {
          if (dt.Mode == 'chillroll thread' || dt.Mode == 'mdo thread' || dt.Mode == 'tdo thread') {
            dtObj.StsMachine.Class = 'warning';
            Obj.Class = 'bgstop';
            dtObj.StsMachine.StateVal = dt.Mode.toUpperCase();
            dtObj.StsMachine.StateCss = '#E63757';
          } else if (dt.Mode == 'tdo speedup' || dt.Mode == 'pullroll thread' || dt.Mode == 'pullroll speedup') {
            dtObj.StsMachine.Class = 'yellow';
            Obj.Class = 'bgstop';
            dtObj.StsMachine.StateVal = dt.Mode.toUpperCase();
            dtObj.StsMachine.StateCss = '#fcdb03';
          } else {
            dtObj.StsMachine.Class = 'warning';
            Obj.Class = 'bgstop';
            dtObj.StsMachine.StateVal = dt.MachineStatus.toUpperCase();
          }
        }

        dtObj.StsMachine.DateStatus = ISI.TglNumDate(dt.Lastdate, dt.Lasttime);

        if (dt.Flag == 'RED') {
          dtObj.StsMachine.WarnOpacity = '1';
          dtObj.StsMachine.WarnOpacity = 'bg-danger border border-warning';
          dtObj.StsMachine.StateOpacity = '0';
        } else {
          dtObj.StsMachine.WarnOpacity = '0';
          dtObj.StsMachine.StateOpacity = '1';
        }

        if (dt.flag != 'S') {
          if (dt.MachineStatus == 'Production' || dt.MachineStatus == 'True') {
            if (id.substring(0, 2) != '500') {
              Obj.Class = 'bgstart';
            }
          } else if (dt.MachineStatus == 'Stop' || dt.MachineStatus == 'False') {
            if (id.substring(0, 2) != '500') {
              Obj.Class = 'bgstop';
            }
          } else if (dt.MachineStatus == 'Filmbreak') {
            Obj.Class = 'bgstop';
          } else if (dt.MachineStatus == 'Startup') {
            Obj.Class = 'bgstop';
          }
        }

        if (dt.RunMeter != '') {
          dtObj.StsMachine.RunMeter = parseFloat(dt.RunMeter).toLocaleString('en');
        }

        SetObj(dtObj);
        setRefreshData(true);
      }
    } else if (topic == 'SPEED') {
      let id = Mch;
      if (dt.Mesin == id) {
        if (dt.flagspd !== null && dt.flagspd !== 'null' && dt.flagspd != '') {
          let dtObj = Obj;
          dtObj.Speed = {};
          dtObj.Speed.Class = 'speed-' + dt.flagspd;
          dtObj.Speed.StdSpeed = parseInt(dt.stdspeed);

          setCountupppp(parseInt(dt.actspeed));
          setRefreshCount(true);
          SetObj(dtObj);
          setRefreshData(true);
        }
      }
    } else if (topic == 'MQTT_DataLake') {
      let id = Mch;
      if (dt.mesin == id) {
        let dtObj = Obj;
        dtObj.DataLake = {};
        dtObj.DataLake.Film = dt?.film;
        dtObj.DataLake.SPKNo = dt?.wono;

        SetObj(dtObj);
        setRefreshData(true);
      }
    } else {
      let dtObj = Obj;
      dtObj.DataLake = {};
      dtObj.DataLake.Film = dt?.Product;
      dtObj.DataLake.SPKNo = dt?.WO;

      SetObj(dtObj);
      setRefreshData(true);
    }
  };

  useEffect(() => {
    setRefreshData(false);
  }, [RefreshData]);

  const { start, pauseResume, reset, update } = useCountUp({
    ref: 'Speed' + Mch + (isfull ? '_FULLY' : ''),
    end: Countupppp,
    enableScrollSpy: true,
    scrollSpyDelay: 1000,
    plugin: Odometer,
    onReset: () => console.log('Resetted!'),
    onUpdate: () => console.log('Updated!'),
    onPauseResume: () => console.log('Paused or resumed!'),
    onStart: ({ pauseResume }) => console.log('Start!'),
    onEnd: ({ pauseResume }) => console.log('Stop!')
  });

  useEffect(() => {
    if (RefreshCount) start();
    setRefreshCount(false);
  }, [RefreshCount]);

  if (!Obj?.Class || Obj?.Class == '') {
    Obj.Class = 'bgstop';
  }
  if (!Obj.StsMachine) {
    Obj.StsMachine = {};
  }
  if (!Obj?.StsMachine?.Class || Obj?.StsMachine?.Class == '') {
    Obj.StsMachine.Class = 'stop';
  }
  if (!Obj?.StsMachine?.StateCss || Obj?.StsMachine?.StateCss == '') {
    Obj.StsMachine.StateCss = '';
  }
  if (!Obj?.StsMachine?.WarnOpacity || Obj?.StsMachine?.WarnOpacity == '') {
    Obj.StsMachine.WarnOpacity = '1';
  }
  if (!Obj?.StsMachine?.StateOpacity || Obj?.StsMachine?.StateOpacity == '') {
    Obj.StsMachine.StateOpacity = '0';
  }

  if (!Obj.Speed) {
    Obj.Speed = {};
  }
  if (!Obj?.Speed?.StdSpeed || Obj?.Speed?.StdSpeed == '') {
    Obj.Speed.StdSpeed = '0';
  }

  return (
    <>
      <div className={className} style={{ background: '#121e2d', borderRadius: '6px', width: Width ? Width : 'auto', transition: 'visibility 0.5s ease-in-out' }} onClick={parentclick}>
        <div className={'card ' + Obj?.Class} style={{ backgroundColor: '#121e2d', color: 'white' }}>
          <div
            className="card-body p-0"
            style={{
              backgroundImage: `url(${Height < 8 ? '' : Mch == 'PET' ? 'https://dgboard.indopoly.co.id/images/linemsn.png' : 'https://dgboard.indopoly.co.id/imes/images/opet.gif'})`,
              'background-position': Mch == 'PET' ? '5vw -50px' : '5vw 10px',
              'background-size': Height + 15 + 'vh',
              'background-repeat': 'no-repeat'
            }}
          >
            <div className="row" style={{ height: Height + 'vh' }}>
              <div className="col-4">
                <div className="position-absolute p-0">
                  <div className="row">
                    <span className="p-0" style={{ 'font-size': setFS('6', percentage) }}>
                      Running Meter
                      <span style={{ color: 'cyan', 'font-size': '10px' }}>(m)</span>
                    </span>
                  </div>
                  <div className="row">
                    <span className="p-0" style={{ 'font-size': setFS('6', percentage) }}>
                      {Obj?.StsMachine?.RunMeter}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-8 pt-2 text-end">
                <div className="" style={{ right: '.7vw', 'line-height': '0.8', height: '30px;' }}>
                  <span className="ps-4" style={{ 'line-height': '0.8', 'font-size': setFS('5', percentage) }}>
                    {parseInt(Obj?.StsMachine?.StatusDays) > 0 ? (
                      <>
                        {Obj?.StsMachine?.StatusDays ? (parseInt(Obj?.StsMachine?.StatusDays) < 10 ? '0' + Obj?.StsMachine?.StatusDays : Obj?.StsMachine?.StatusDays) : '00'}
                        <span style={{ color: 'cyan', 'font-size': setFS('7', percentage) }}>d</span>
                      </>
                    ) : (
                      ''
                    )}
                    {parseInt(Obj?.StsMachine?.StatusHour) > 0 || parseInt(Obj?.StsMachine?.StatusDays) != 0 ? (
                      <>
                        {Obj?.StsMachine?.StatusHour ? (parseInt(Obj?.StsMachine?.StatusHour) < 10 ? '0' + Obj?.StsMachine?.StatusHour : Obj?.StsMachine?.StatusHour) : '00'}
                        <span className="" style={{ color: 'cyan', 'font-size': setFS('7', percentage) }}>
                          h
                        </span>
                      </>
                    ) : (
                      ''
                    )}
                    {Obj?.StsMachine?.StatusMinutes ? (parseInt(Obj?.StsMachine?.StatusMinutes) < 10 ? '0' + Obj?.StsMachine?.StatusMinutes : Obj?.StsMachine?.StatusMinutes) : '00'}
                    <span className="" style={{ color: 'cyan', 'font-size': setFS('7', percentage) }}>
                      m
                    </span>

                    {Obj?.StsMachine?.StatusSecond ? (parseInt(Obj?.StsMachine?.StatusSecond) < 10 ? '0' + Obj?.StsMachine?.StatusSecond : Obj?.StsMachine?.StatusSecond) : '00'}
                    <span className="" style={{ color: 'cyan', 'font-size': setFS('7', percentage) }}>
                      s
                    </span>
                  </span>
                  <span className={Obj?.StsMachine?.Class} style={{ display: '-webkit-inline-box', width: setFS('7', percentage), height: setFS('7', percentage) }}></span>
                </div>

                {isfull ? (
                  <h1 className="fw-bold pt-1 " style={{ color: 'cyan', 'line-height': '0.7', 'font-size': setFS('2', percentage) }}>
                    {Mch}
                  </h1>
                ) : (
                  ''
                )}
                <div className="text-end" style={{ marginTop: '-' + setFS('10', percentage) }}>
                  <span
                    className="badge badge-pill bg-danger border border-warning blink_me text-center"
                    style={{ 'line-height': ' 0.9', ' height': '23px', ' width': ' 110px', opacity: Obj?.StsMachine?.WarnOpacity, display: Obj?.StsMachine?.WarnOpacity == 0 ? 'none' : 'block' }}
                  >
                    DISCONNECTED
                  </span>
                  <span className="blink_mine" style={{ 'font-weight': '700', 'font-size': setFS('7', percentage), color: Obj?.StsMachine?.StateCss }}>
                    {Obj?.StsMachine?.StateVal}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card-footer p-0 row" style={{ height: setFS('3', percentage) }}>
            <div className="col-4 text-center ">
              <div className="text-center text-wrap">
                <span className="m-0" style={{ 'font-size': setFS('5', percentage), 'line-height': setFS('6', percentage) }}>
                  {Obj?.DataLake?.Film}
                </span>
              </div>
            </div>
            <div className="col-4">
              <div className="text-center text-wrap">
                <span className="m-0" style={{ 'font-size': setFS('5', percentage), 'line-height': setFS('6', percentage) }}>
                  {Obj?.DataLake?.SPKNo}
                </span>
              </div>
            </div>
            <div className="col-4 ps-0 pe-0 text-end d-flex align-items-end">
              <div className="row " style={{ width: 'fit-content', marginTop: '-' + mtfooter + 'rem' }}>
                <div className="col-auto p-0 pe-1 m-0" style={{ 'text-align': 'right' }}>
                  <span
                    className={'align-items-end m-0 ' + Obj?.Speed?.Class}
                    style={{ 'text-align-last': 'left', 'line-height': '0', 'font-size': setFS('4', percentage), marginTop: percentage == 100 ? '0' : '-' + setFS('7', percentage) }}
                    id={'Speed' + Mch + (isfull ? '_FULLY' : '')}
                  >
                    0
                  </span>
                  {isfull && (
                    <>
                      <br />
                      <div className="col-12" style={{ 'text-align-last': 'right', marginTop: percentage == 100 ? setFS('15', percentage) : '-' + setFS('7', percentage) }}>
                        <small className="px-0 text-warning align-items-end">
                          <span className="" style={{ lineHeight: '0', 'font-size': setFS('6', percentage), marginTop: '-' + setFS('4', percentage) }}>
                            {Obj?.Speed?.StdSpeed}
                          </span>
                        </small>
                      </div>
                    </>
                  )}
                </div>
                <div className="col-5 p-0 m-0" style={{ 'text-align': 'left', width: 'fit-content' }}>
                  <span style={{ 'font-weight': 'bolder', color: 'cyan', 'font-size': setFS('7', percentage) }}>mpm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OCCBigMachine;
