
import { ChangeEvent, InputHTMLAttributes, useState } from 'react';
import './App.css'
import React from 'react';


interface Story {
  objectID: number;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
}

const App = () => {

  const [searchTerm, setSearchTerm] = React.useState('React');

  // console.log('App rendering');

  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  let filteredStories: Story[] = stories;

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

  const searchedStories = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));


  return (<div>

    <h1>My Hacker Stories</h1>

    <Search search={searchTerm} onSearch={handleSearch} />

    <hr />

    <List list={searchedStories} />
  </div>
  )
}

interface ListProps {
  list: Story[]
}

interface ItemProps {
  key : number,
  title: string,
  url: string 
  author: string,
  num_comments:number
  points: number
}

interface SearchProps {
  onSearch: (event: ChangeEvent<HTMLInputElement>) => void
  search : string
}


const Search = ({ search, onSearch }: SearchProps) => {

  // console.log('Search rendering'); 

  return (<div>
    <label htmlFor='search'>Search</label>
    <input id='search' type='text' value={search} onChange={onSearch} />
  </div>
  );
}

const List = ({list}: ListProps) => {

  // console.log('List rendering');
  return (<div>
    <ul>
      {
        list.map(({objectID, ...item}) => (
          <Item key={objectID} {...item}/>
        )
        )
      }
    </ul>
  </div>
  )
}



const Item = ({ 
  url,
  title,
  author,
  num_comments,
  points
}: ItemProps
) => (
  <li>
    <span>
      <a href={url}>{title}</a>
    </span>
    <span>{author}</span>
    <span>{num_comments}</span>
    <span>{points}</span>
  </li>
)


export default App
