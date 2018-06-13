import React, { Component } from "react";
import ReactDOM from "react-dom";

document.addEventListener("DOMContentLoaded", function() {
  //special event that starts when DOM tree is loaded
  //our JS code should be inside
  class TempTable extends Component {
    //create TempTable component
    constructor(props) {
      super(props);
      this.state = {
        //set all necessary states
        arrOfTemp: [], //here we push temps from weatherData
        min: "", //minimal temp
        max: "", //maximum temp
        mean: "", //mean temp
        mode: "", //mode temp
        inputValue: "" //temp entered by us
      };
    }

    getTemp = () => {
      let arrOfTemp = this.props.weatherData.list.map(elem => {
        return elem.main.temp.toFixed(1); //get temp from every element of weatherData by map function;
      }); //toFixed(1) = get number with one digit after coma;
      this.setState({
        arrOfTemp: arrOfTemp //set state -> array of temps
      });
    };

    showMin = () => {
      this.setState({
        min: Math.min(...this.state.arrOfTemp) //return the number with the lowest value, we use here
      }); //also spread operator to get particular numbers as arguments
    };

    showMax = () => {
      this.setState({
        max: Math.max(...this.state.arrOfTemp) //return the number with the highest value, we use here
      }); //also spread operator to get particular numbers as arguments
    };

    showMean = () => {
      let numbArr = this.state.arrOfTemp.map(Number); //in return we get array of numbers (not array of strings)
      let total = numbArr.reduce((total, currValue) => {
        return total + currValue; //getting sum
      }, 0);
      let calculateMean = total / this.state.arrOfTemp.length;
      this.setState({
        mean: calculateMean.toFixed(1)  //toFixed(1) = get number with one digit after coma and set state;
      });
    };

    showMode = () => {  //get temp which appear most often
      let counts = {};  //create empty object
      for (let i = 0; i < this.state.arrOfTemp.length; i++) { //for loop
        let number = this.state.arrOfTemp[i]; //take one element
        if (counts[number] === undefined) { //if this one element not exist in counts, he's a key and it get value '1'
          counts[number] = 1;
        } else {
          counts[number] = counts[number] + 1;  //if exist, he's a key and we add to his value '+1'
        }
      }
      let sortArr = Object.keys(counts).sort((a, b) => {  //get array of given object's property names
        return counts[b] - counts[a]; //sort keys with highest value to lowest value
      });
      this.setState({
        mode: sortArr[0]  //key with highest value which is first in array is our mode temp
      });
    };

    componentWillMount() {  //get all temps just before mounting & render
      this.getTemp();
    }

    componentDidMount() { //invoked functions immediately after mounting
      this.showMin();
      this.showMax();
      this.showMean();
      this.showMode();
    }

    componentDidUpdate(prevProps, prevState) {  //component lifecycle - if we add any temp to our state with temps,
      if (prevState.arrOfTemp !== this.state.arrOfTemp) { //component is updating because previous state is different
        this.showMin();                                   //from actual state and all function
        this.showMax();                                   //which calculate values are invoked again
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
              <th>
                <h3>Temperature in next five days in Wroclaw</h3>
              </th>
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
    //create component
    constructor(props) {
      super(props);
      this.state = {
        weatherData: "" //set general state where we have all data from API, at this moment is empty
      };
    }

    getData = () => {
      //function where we fetch & set state
      let URL =
        "https://api.openweathermap.org/data/2.5/forecast?q=Wroclaw,PL&APPID=6753e73d5ef9b6dd559417b3c2d59020";

      //save under variable link to our API with key

      fetch(URL)
        .then(response => {
          return response.json(); //we get response and we extracting JSON body content from response
        })
        .then(data => {
          console.log(data); //see what we get and how it looks and how to get to right data
          this.setState({
            weatherData: data //now our data will be avaible from state called 'weatherData'
          });
        })
        .catch(error => {
          console.log(error); //if we can't get data from API, we get error
        });
    };

    componentWillMount() {
      //method invoked just before mounting, called before render
      this.getData();
    }

    render() {
      //rendering component
      if (!this.state.weatherData) {
        //if state is empty, empty div with nothing is render
        return <div />;
      } else {
        return <TempTable weatherData={this.state.weatherData} />; //if state has something ;-)
      }
    }
  }

  ReactDOM.render(<App />, document.getElementById("app")); //inject component App into DOM
});
