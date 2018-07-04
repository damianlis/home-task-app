import React, { Component } from "react";
import TempTable from "./TempTable.jsx";

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

export default App;
