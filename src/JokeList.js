import React, { useEffect, useState } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

function JokeList({ numJokesToGet = 5 }) {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getJokes() {
    try {
      let newJokes = [];
      let seenJokes = new Set();

      while (newJokes.length < numJokesToGet) {
        const res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });

        const joke = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);

          newJokes.push({
            ...joke,
            votes: 0
          });
        }
      }

      setJokes(newJokes);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getJokes();
  }, []);

  function generateNewJokes() {
    setIsLoading(true);
    getJokes();
  }

  function vote(id, delta) {
    setJokes(jokes =>
      jokes.map(joke =>
        joke.id === id
          ? { ...joke, votes: joke.votes + delta }
          : joke
      )
    );
  }

  const sortedJokes = [...jokes].sort(
    (a, b) => b.votes - a.votes
  );

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  return (
    <div className="JokeList">
      <button
        className="JokeList-getmore"
        onClick={generateNewJokes}
      >
        Get New Jokes
      </button>

      {sortedJokes.map(joke => (
        <Joke
          text={joke.joke}
          key={joke.id}
          id={joke.id}
          votes={joke.votes}
          vote={vote}
        />
      ))}
    </div>
  );
}

export default JokeList;