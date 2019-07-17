import React from 'react'
import { push } from 'connected-react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import './calc.css';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';

const apiUrl = "https://vhjtg39hhc.execute-api.us-east-1.amazonaws.com/Development";

class NSMCalc extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      activeStep: 0,
      yesNoAnswer: false,
      values: [],
      currentValue: undefined
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.setupValuesArray();

    fetch('https://randomuser.me/api/')
      .then(results => {
        return results.json();
      })
      .then(data => {
        this.setState({ person: data.results[0].cell })
      });
  }

  render() {
    const steps = this.getSteps();
    const { activeStep, yesNoAnswer } = this.state;

    return(
      <div className="page-wrapper">
        <div className="stepper-wrapper">
          <Stepper activeStep={activeStep} orientation="vertical" className="stepper">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel color='#8e44ad'>{label}</StepLabel>
                <StepContent>
                  <Typography>{this.getStepContent(index)}</Typography>

                  {/* At step 1, show a normal input */}
                  {activeStep === 1 && 
                      <div className="step-input-wrapper">
                        <Input value={this.state.values[activeStep].value} onChange={this.handleInputChange} placeholder="" type="number" className="step-input" inputProps={{'aria-label': 'Description',}}/>
                      </div>
                  }

                  {/* At step 4, show the height and weight fields */}
                  {activeStep === 4 && 
                        <div className="height-weight-wrapper">
                          <TextField
                            label="feet"
                            className="text-field feet-field"
                            type="number"
                            margin="normal"
                            name="feet"
                            value={this.state.values[activeStep].feet} onChange={this.handleInputChange}
                          />
                          <TextField
                            label="inches"
                            className="text-field inches-field"
                            type="number"
                            margin="normal"
                            name="inches"
                            value={this.state.values[activeStep].inches} onChange={this.handleInputChange}
                          />
                          <TextField
                            label="pounds"
                            className="text-field pounds-field"
                            type="number"
                            margin="normal"
                            name="pounds"
                            value={this.state.values[activeStep].pounds} onChange={this.handleInputChange}
                          />
                        </div>
                  }

                  {/* At step 5, show the therapeutic and prophylactic radion fields */}
                  {activeStep === 5 &&
                    <div className="treatment-reason">
                      <div className="radio-wrapper">
                        <RadioGroup
                          aria-label="RadioGroup"
                          name="treatmentreasongroup"
                          className="radio-group"
                          value={this.state.values[activeStep].value} onChange={this.handleInputChange}
                        >
                          <FormControlLabel className="radio-btn no-radio" value="therapeutic" control={<Radio />} label="Therapeutic" />
                          <FormControlLabel className="radio-btn yes-radio" value="prophylactic" control={<Radio />} label="Prophylactic" />
                        </RadioGroup>
                      </div>
                    </div>
                  }

                  {/* At step 10, show the breast size pictures */}
                  {activeStep === 10 &&
                    <div className="breast-size">
                      <div className="radio-wrapper">
                        <RadioGroup
                          aria-label="RadioGroup"
                          name="breastsizegroup"
                          className="radio-group"
                          value={this.state.values[activeStep].value} onChange={this.handleInputChange}
                        >
                          <div className="radio-image-wrapper">
                            <div className="radio-image" style={{ backgroundImage: "url(/images/breast-a.png)" }}></div>
                            <FormControlLabel className="radio-btn no-radio" value="a" control={<Radio />} label="<400 grams (~A-B cup)" />
                          </div>
                          <div className="radio-image-wrapper">
                            <div className="radio-image" style={{ backgroundImage: "url(/images/breast-c.png)" }}></div>
                            <FormControlLabel className="radio-btn yes-radio" value="b" control={<Radio />} label="400-799 grams (~C cup)" />
                          </div>
                          <div className="radio-image-wrapper">
                            <div className="radio-image" style={{ backgroundImage: "url(/images/breast-d.png)" }}></div>
                            <FormControlLabel className="radio-btn yes-radio" value="c" control={<Radio />} label="≥ 800 grams (~D cup or greater)" />
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  }
                  {/* At step 11, show the breast incision picture */}
                  {activeStep === 11 &&
                    <div className="incision">
                      <div className="incision-image" style={{ backgroundImage: "url(/images/breast-incisions.png)" }}></div>
                      <div className="radio-wrapper">
                        <RadioGroup
                          aria-label="RadioGroup"
                          name="incisiongroup"
                          className="radio-group"
                          value={this.state.values[activeStep].value} onChange={this.handleInputChange}
                        >
                          <FormControlLabel className="radio-btn no-radio" value="periareolar" control={<Radio />} label="Periareolar incision" />
                          <FormControlLabel className="radio-btn yes-radio" value="lateral-radial" control={<Radio />} label="Lateral radial incision" />
                          <FormControlLabel className="radio-btn yes-radio" value="vertical-radial" control={<Radio />} label="Vertical radial incision" />
                          <FormControlLabel className="radio-btn yes-radio" value="inframammary" control={<Radio />} label="Inframammary fold incision" />
                        </RadioGroup>
                      </div>
                    </div>
                  }

                  
                  {/* At step 5, show the therapeutic and prophylactic radion fields */}
                  {activeStep === 12 &&
                    <div className="treatment-reason">
                      <div className="radio-wrapper">
                        <RadioGroup
                          aria-label="RadioGroup"
                          name="reconstructiontypegroup"
                          className="radio-group"
                          value={this.state.values[activeStep].value} onChange={this.handleInputChange}
                        >
                          <FormControlLabel className="radio-btn no-radio" value="tissueExpander" control={<Radio />} label="Tissue Expander" />
                          <FormControlLabel className="radio-btn yes-radio" value="immediateImplant" control={<Radio />} label="Immediate Implant" />
                          <FormControlLabel className="radio-btn yes-radio" value="autologous" control={<Radio />} label="Autologous" />
                        </RadioGroup>
                      </div>
                    </div>
                  }

                  {/* If the step is a yes/no question, show the radio buttons */}
                  {yesNoAnswer === true && 
                  <div className="radio-wrapper">
                        <RadioGroup
                          aria-label="Radio Group"
                          name="yesnogroup"
                          className="radio-group"
                          value={this.state.values[activeStep].value} onChange={this.handleInputChange}
                        >
                          <FormControlLabel className="radio-btn no-radio" value="0" control={<Radio />} label="No" />
                          <FormControlLabel className="radio-btn yes-radio" value="1" control={<Radio />} label="Yes" />
                        </RadioGroup>
                  </div>
                  }

                  {/* Buttons */}
                  <div className="action-container">
                    <div>

                      {/* At step 0, show the begin button only */}
                      {activeStep === 0 &&
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.handleNext}
                          className="button-begin"
                        >
                          Begin 
                        </Button>
                      }

                      {/* All steps greater than 0, show the back and next buttons */}
                      {activeStep > 0 &&
                        <div className="back-next-btns">
                          <Button
                            variant="contained"
                            disabled={activeStep === 0}
                            color="primary"
                            onClick={this.handleBack}
                            className="button-secondary back-btn"
                          >
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleNext}
                            className="button-primary next-btn"
                          >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                          </Button>
                        </div>
                      }
                    </div>
                  </div>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          {/* Message shown when form is finished */}
          {activeStep === steps.length && (
            <Paper square elevation={0} className="reset-container">
              <Typography>All steps completed - you&apos;re finished</Typography>
              <Button onClick={this.handleReset} className="button">
                Reset
              </Button>
            </Paper>
          )}
        </div>
      </div>
    );
  }

  getSteps() {
    var steps = [
      'Nipple Sparing Mastectomy - Predicted Risk Percentage',
      'What is your age?',
      'Do you currently smoke tobacco?',
      'Do you have diabetes mellitus?',
      'What is your current height and weight?',
      'Are you having a mastectomy for breast cancer (therapeutic) or to prevent future breast cancer (prophylactic)?',
      'Have you ever had chemotherapy in the past?',
      'Have you ever had radiation therapy to this breast or your chest area in the past?',
      'Do you expect to need radiation therapy for your breast after your mastectomy?',
      'Do you expect to need chemotherapy after your mastectomy?',
      'How large is your breast?',
      'What incision is your surgeon planning to use for your mastectomy?',
      'What type of breast reconstruction are you having?'
    ];

    return steps;
  }

  getStepContent(step) {
    switch (step) {
      case 0:
        return `
        The following questions will help to predict the odds of having a complication during breast reconstruction after nipple-sparing mastectomy. 
        This tool can help give you and/or your surgeons more information for the decision-making process regarding breast reconstruction. 
        It is important to recognize that this is a predictive tool and cannot perfectly guarantee a positive or negative outcome after breast reconstruction and nipple-sparing mastectomy.
        Please note, if you are undergoing nipple-sparing mastectomy on only one breast (unilateral), please answer all questions for the breast undergoing the procedure. 
        If you are undergoing nipple-sparing mastectomy on both breasts (bilateral), please answer all questions for one breast first and repeat the process for the second breast after as each predicted percentage will pertain to each respective breast.`;

      default:
        return '';
    }
  }

  setupValuesArray = () => {
    var valuesArr = [
      // 0
      {
        value: ""
      },

      // 1
      {
        value: ""
      },

      // 2
      {
        value: ""
      },

      // 3
      {
        value: ""
      },

      // 4
      {
        value: "",
        feet: "",
        inches: "",
        pounds: ""
      },

      // 5
      {
        value: ""
      },

      // 6
      {
        value: ""
      },

      // 7
      {
        value: ""
      },

      // 8
      {
        value: ""
      },

      // 9
      {
        value: ""
      },

      // 10
      {
        value: ""
      },

      // 11
      {
        value: ""
      },

      // 12
      {
        value: ""
      }
    ];

    this.setState(state => ({
      values: valuesArr,
      currentValue: valuesArr[0]
    }));
  };

  handleNext = () => {
    this.handleStep(this.state.activeStep + 1);
  };

  handleBack = () => {
    this.handleStep(this.state.activeStep - 1);
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  handleStep = (newStep) => {
    this.setState(state => ({
      activeStep: newStep,
      currentValue: state.values[newStep]
    }), () => {

      switch (newStep) {
        case 0:
          this.setState(state => ({
            yesNoAnswer: false
          }));
          break;

        case 1:
          this.setState(state => ({
            yesNoAnswer: false,
          }));
          break;

        case 2:
          this.setState(state => ({
            yesNoAnswer: true,
          }));
          break;

        case 3:
          this.setState(state => ({
            yesNoAnswer: true,
          }));
          break;

        case 4:
          this.setState(state => ({
            yesNoAnswer: false,
          }));
          break;

        case 5:
          this.setState(state => ({
            yesNoAnswer: false,
          }));
          break;

        case 6:
          this.setState(state => ({
            yesNoAnswer: true,
          }));
          break;

        case 7:
          this.setState(state => ({
            yesNoAnswer: true,
          }));
          break;

        case 8:
          this.setState(state => ({
            yesNoAnswer: true,
          }));
          break;

        case 9:
          this.setState(state => ({
            yesNoAnswer: true,
          }));
          break;

        case 10:
          this.setState(state => ({
            yesNoAnswer: false,
          }));
          break;

        case 11:
          this.setState(state => ({
            yesNoAnswer: false,
          }));
          break;

        case 12:
          this.setState(state => ({
            yesNoAnswer: false,
          }));
          break;

        case 13:
          this.setState(state => ({
            yesNoAnswer: false,
          }));
          break;

        default:
          this.setState(state => ({
            yesNoAnswer: false,
          }));
          break;
      }
    });
  };

  handleInputChange(event) {
    var values = this.state.values;
    var activeStep = this.state.activeStep;
    var inputName = event.target.getAttribute("name");

    switch (activeStep) {
      case 4:
        if (inputName == "feet") {
          values[activeStep].feet = event.target.value;
        }
        else if (inputName == "inches") {
          values[activeStep].inches = event.target.value;
        }
        else if (inputName == "pounds") {
          values[activeStep].pounds = event.target.value;
        }
        break;

      default:
        values[activeStep].value = event.target.value;
        break;
    }

    this.setState({
      values: values
    });
  }
}

const mapStateToProps = ({ counter }) => ({
  count: counter.count
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changePage: () => push('/about-us')
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NSMCalc)