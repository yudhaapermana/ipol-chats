import React, { useEffect, useState } from 'react';
import Joyride, { LIFECYCLE, ACTIONS, EVENTS, ORIGIN, STATUS } from 'react-joyride';

const IsiGuide = ({ IsStart, StartFunction, Steps, Action }) => {
  const [stepIndexState, setStepIndexState] = useState(0);
  const [dataCallBack, setDataCallBack] = useState(null);
  let stepsNew = [
    {
      content: (
        <h4 style={{ color: 'black' }}>
          Need Guideline ?<br />
          (Please Click Next)
        </h4>
      ),
      target: 'body',
      placement: 'center'
    }
  ];
  for (let ix = 0; ix < Steps.length; ix++) {
    const element = Steps[ix];
    stepsNew.push(element);
  }

  const JoyCallBack = data => {
    const { status, type, action, index } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      StartFunction(false);
      setStepIndexState(0);
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const stepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      setStepIndexState(stepIndex);
    }
    console.log(data);
    if (data.action == 'update') {
      setDataCallBack(data);
    }
  };

  const JoyGetHelpers = data => {
    return data;
  };
  useEffect(() => {
    moveBootStrap();
    if (Action && dataCallBack) {
      if (dataCallBack.step.target.substr(0, 1) == '#') {
        if (Action[dataCallBack.step.target.substr(1, dataCallBack.step.target.length)] != '') {
          setStepIndexState(stepIndexState + 1);
        }
      } else {
        setStepIndexState(stepIndexState + 1);
      }
    }
  }, [Action]);

  function moveBootStrap() {
    let tot = document.getElementsByClassName('bootstrap-datetimepicker-widget').length;
    for (let ix = 0; ix < tot; ix++) {
      document.body.appendChild(document.getElementsByClassName('bootstrap-datetimepicker-widget')[0]);
    }
  }

  if (IsStart) {
    moveBootStrap();
  }

  useEffect(() => {
    moveBootStrap();
  }, [Steps]);

  return (
    <>
      {IsStart ? (
        <Joyride
          continuous
          callback={JoyCallBack}
          run={IsStart}
          steps={stepsNew}
          stepIndex={stepIndexState}
          getHelpers={JoyGetHelpers}
          hideCloseButton
          scrollToFirstStep
          showSkipButton
          showProgress
          // floaterProps={{ placement: 'left' }}
          lifecycle={LIFECYCLE.TOOLTIP}
          styles={{
            options: {
              zIndex: 10000
            }
          }}
        />
      ) : (
        ''
      )}
    </>
  );
};
export default IsiGuide;
