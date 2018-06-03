import React, { Component } from "react";
import ReactDOM from "react-dom";

document.addEventListener("DOMContentLoaded", function() {
  class TempTable extends Component {
    constructor(props) {
      super(props);
      this.state = {
        min: "",
        max: "",
        mean: "",
        mode: ""
      };
    }

    showMin = () => {
      let arrOfTemp = this.props.weatherData.list.map(elem => {
        return elem.main.temp.toFixed(1);
      });
      //console.log(arrOfTemp);
      this.setState({
        min: Math.min(...arrOfTemp)
      });
    };

    showMax = () => {
      let arrOfTemp = this.props.weatherData.list.map(elem => {
        return elem.main.temp.toFixed(1);
      });
      //console.log(arrOfTemp);
      this.setState({
        max: Math.max(...arrOfTemp)
      });
    };

    showMean = () => {
      let total = this.props.weatherData.list.reduce((total, currValue) => {
        return total + currValue.main.temp;
      }, 0);
      let calculateMean = total / this.props.weatherData.list.length;
      this.setState({
        mean: calculateMean.toFixed(1)
      });
    };

    showMode = () => {
      let arrOfTemp = this.props.weatherData.list.map(elem => {
        return elem.main.temp.toFixed(1);
      });
      let counts = {};
      for (let i = 0; i < arrOfTemp.length; i++) {
        let number = arrOfTemp[i];
        if (counts[number] === undefined) {
          counts[number] = 1;
        } else {
          counts[number] = counts[number] + 1;
        }
      }
      //console.log(counts);
      let sortArr = Object.keys(counts).sort((a, b) => {
        return counts[b] - counts[a];
      });
      this.setState({
        mode: sortArr[0]
      });
    };

    componentDidMount() {
      this.showMin();
      this.showMax();
      this.showMean();
      this.showMode();
    }

    render() {
      return (
        <table style={{ textAlign: "center" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Temperature</th>
            </tr>
          </thead>
          <tbody>
            {this.props.weatherData.list.map((elem, index) => {
              return (
                <tr key={index}>
                  <td>{elem.dt_txt}</td>
                  <td>{elem.main.temp.toFixed(1)}</td>
                </tr>
              );
            })}
            <tr />
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
        "http://api.openweathermap.org/data/2.5/forecast?q=Wroclaw,PL&APPID=6753e73d5ef9b6dd559417b3c2d59020";

      fetch(URL)
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data);
          //console.log(data.city.name);
          //console.log(data.list[0].main.temp);
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
