import React from "react";
import { Button, Container, Header, Icon, Form } from "semantic-ui-react";
import UserChart from './UserChart';

class Home extends React.Component {
  state = {
    username: "",
    tweets: [],
    emotions: []
  };

  handleChange = e => {
    this.setState({ username: e.target.value });
  };

  handleSubmit = () => {
    console.log('bob', this.state.username);
      fetch(`https://cors-anywhere.herokuapp.com/https://api.twitter.com/1.1/statuses/user_timeline/${this.state.username}.json?count=2`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer AAAAAAAAAAAAAAAAAAAAAKik9wAAAAAAeEy8mNdChB3cu0SaakLzTJvOiJk%3Dl39cr6lRLidFjMwu4d5LVWHZrw312YT4k08OpCrApjw8NERmvG"
        }
      }).then(resp=>resp.json()).then(tweets => {
        this.setState({
          tweets: tweets
        })
        tweets.forEach(tweet => this.checkEmotion(tweet))
      })
  };

  checkEmotion = tweet => {
    var unirest = require("unirest");
    unirest
      .post("https://twinword-emotion-analysis-v1.p.rapidapi.com/analyze/")
      .header("X-RapidAPI-Host", "twinword-emotion-analysis-v1.p.rapidapi.com")
      .header(
        "X-RapidAPI-Key",
        "16cc5bd8dcmsh6907259db58b42cp1abd80jsn031467cd6f42"
      )
      .header("Content-Type", "application/x-www-form-urlencoded")
      .send(`text=${tweet}`)
      .end(emotion => {
        console.log(emotion, tweet);
        this.setState({emotions: [...this.state.emotions, emotion.body]})
      });
  };

  render() {
    return (
      <Container textAlign="center" id="twitter-form">
        <Header as="h2" icon textAlign="center" inverted>
          <Header.Content id="logo">inner most</Header.Content>
          <Icon name="user" inverted />
        </Header>
        <Form onSubmit={this.handleSubmit}>
          <Form.Input
          disabled={!this.props.signedIn.isSignedIn}
            id="twitter-input"
            value={this.state.username}
            onChange={this.handleChange}
            placeholder="type your twitter username"
            style={{ maxWidth: "200px" }}
          />
          <Button inverted> Submit </Button>
          {this.state.emotions.length === this.state.tweets.length && this.state.emotions.length > 0 ? <UserChart emotions={this.state.emotions} tweets={this.state.tweets} /> : null}
        </Form>
      </Container>
    );
  }
}

export default Home;
