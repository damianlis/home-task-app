import React, { Component } from "react";
import ReactDOM from "react-dom";

document.addEventListener("DOMContentLoaded", function() {
  class TempTable extends Component {
    constructor(props) {
      super(props);
      this.state = {
        arrOfTemp: [],
        min: "",
        max: "",
        mean: "",
        mode: "",
        inputValue: ""
      };
    }

    getDateAndTemp = () => {
      let arrOfTemp = this.props.weatherData.list.map(elem => {
        return elem.main.temp.toFixed(1);
      });
      this.setState({
        arrOfTemp: arrOfTemp
      });
    };

    showMin = () => {
      this.setState({
        min: Math.min(...this.state.arrOfTemp)
      });
    };

    showMax = () => {
      this.setState({
        max: Math.max(...this.state.arrOfTemp)
      });
    };

    showMean = () => {
      let numbArr = this.state.arrOfTemp.map(Number);
      let total = numbArr.reduce((total, currValue) => {
        return total + currValue;
      }, 0);
      let calculateMean = total / this.state.arrOfTemp.length;
      this.setState({
        mean: calculateMean.toFixed(1)
      });
    };

    showMode = () => {
      let counts = {};
      for (let i = 0; i < this.state.arrOfTemp.length; i++) {
        let number = this.state.arrOfTemp[i];
        if (counts[number] === undefined) {
          counts[number] = 1;
        } else {
          counts[number] = counts[number] + 1;
        }
      }
      let sortArr = Object.keys(counts).sort((a, b) => {
        return counts[b] - counts[a];
      });
      this.setState({
        mode: sortArr[0]
      });
    };

    componentWillMount() {
      this.getDateAndTemp();
    }

    componentDidMount() {
      this.showMin();
      this.showMax();
      this.showMean();
      this.showMode();
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevState.arrOfTemp !== this.state.arrOfTemp) {
        this.showMin();
        this.showMax();
        this.showMean();
        this.showMode();
      }
    }

    insertValue = () => {
      let numbWithComa = this.state.inputValue.replace(/\,/g, ".");
      let createNumb = Number(numbWithComa);
      let numbFixed = createNumb.toFixed(1);
      let mergeArr = [...this.state.arrOfTemp, numbFixed];
      this.setState({
        arrOfTemp: mergeArr,
        inputValue: ""
      });
    };

    render() {
      return (
        <table style={{ textAlign: "center" }}>
          <thead>
            <tr>
              <th>Temperature in next five days</th>
            </tr>
          </thead>
          <tbody>
            {this.state.arrOfTemp.map((elem, index) => {
              return (
                <tr key={index}>
                  <td>{elem}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2" style={{ fontSize: "20px" }}>
                Min is: {this.state.min}
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ fontSize: "20px" }}>
                Max is: {this.state.max}
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ fontSize: "20px" }}>
                Mean is: {this.state.mean}
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ fontSize: "20px" }}>
                Mode is: {this.state.mode}
              </td>
            </tr>
            <tr>
              <td>
                <input
                  value={this.state.inputValue}
                  onChange={event => {
                    this.setState({ inputValue: event.currentTarget.value });
                  }}
                  placeholder="Write a temp"
                />
                <button onClick={this.insertValue}>Add temp</button>
              </td>
            </tr>
          </tfoot>
        </table>
      );
    }
  }

  class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        weatherData: ""
      };
    }

    getData = () => {
      let URL =
        "https://api.openweathermap.org/data/2.5/forecast?q=Wroclaw,PL&APPID=6753e73d5ef9b6dd559417b3c2d59020";

      fetch(URL)
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data);
          this.setState({
            weatherData: data
          });
        })
        .catch(error => {
          console.log(error);
        });
    };

    componentWillMount() {
      this.getData();
    }

    render() {
      if (!this.state.weatherData) {
        return <div />;
      } else {
        return <TempTable weatherData={this.state.weatherData} />;
      }
    }
  }

  ReactDOM.render(<App />, document.getElementById("app"));
});
