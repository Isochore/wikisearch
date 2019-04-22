import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';




class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText : '', source : []
    }; /*déclaration du state*/
    this.handleChange = this.handleChange.bind(this);
  }
  

 
  handleChange (searchText) { /*gérer la saisie*/
    const orig = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=";
    const limit = "&srlimit=10&srprop=size&formatversion=2&format=json&origin=*";
    
    var newLink = orig + searchText + limit; /*assemblage du lien*/

    this.setState({searchText : searchText}); /*actualiser le state en fonction de la saisie*/
    
    if(searchText.length > 0) {
    
    fetch( newLink , {
    method: 'POST',
    headers: new Headers( {
        'Api-User-Agent': 'MyCoolTool/1.1 (https://example.org/MyCoolTool/; MyCoolTool@example.org) BasedOnSuperLib/1.4'
    } ) /*donner une identité à la requête pour qu'elle soit autorisée par l'API*/
      
} ).then(( response ) => {
		response.json().then( (data) =>
    this.setState({source : data["query"]["search"]})) /*actualiser le state avec les données qui correspondent à la saisie*/
} );
    }
    else {
      this.setState({source : []})
    }
      
    
  }
  
  
  render() {
    return(
      <div>
        <SearchBar searchText = {this.state.searchText} 
        onSearchChange = {this.handleChange}  /> 
        <ResultsArea results = {this.state.source} /> 
      </div>
    );
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super();
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange (e) {
    this.props.onSearchChange(e.target.value); /*passer la saisie à l'autre component*/
  }
  
  render() {
    return(
      <div>  
        <div className="random-article">
          <a href="https://en.wikipedia.org/wiki/Special:Random" target="_blank">
            <h2>Take me to a random article</h2>
          </a>
        </div>
        <div className="search-box">
          <input type="search" height="150" 
          placeholder="Or search.." value={this.props.searchText}
          onChange={this.handleChange} />
        </div>
      </div>
    );
  }
}

class ResultsArea extends React.Component {
  
  render() {
    var rows = [];
    
    this.props.results.forEach((result) => {
      rows.push(
        <ResultRow result = {result} key = {result.pageid} />
      ); /*affecter les résultats à une clé unique*/
    });
    
    return(
      <div className = "resultsArea">
        {rows}
      </div>
    );
  }
}

class ResultRow extends React.Component {
  
  render() { /*gérer les différents résultats*/
    var pageId = this.props.result.pageid;
    var rawLink = "https://en.wikipedia.org/?curid=digit";
    var link = rawLink.replace("digit", pageId)
    return(
      <div className = "result">
        <a href = {link} target="_blank">
          {this.props.result.title}
        </a>
      </div>
    );
  }
}

export default App;
