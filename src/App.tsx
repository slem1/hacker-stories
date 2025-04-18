
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

  const [searchTerm, setSearchTerm] = React.useState('');

  console.log('App rendering');
    
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
  
  let filteredStories : Story[] = stories;

  const handleSearch = (event:ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);       
  }

  const searchedStories = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));


  return (<div>

    <h1>My Hacker Stories</h1>

    <Search onSearch={handleSearch}/>

    <hr />

    <List list={searchedStories} />
  </div>
  )
}

interface ListProps {
  list: Story[]
}

interface ItemProps {
  item: Story
}

interface SearchProps {
  onSearch : (event: ChangeEvent<HTMLInputElement>) => void
}


const Search = ({onSearch} : SearchProps) => {

  console.log('Search rendering'); 

  return (<div>
    <label htmlFor='search'>Search</label>
    <input id='search' type='text' onChange={onSearch} />    
  </div>
  );
}

const List = (props: ListProps) => {

  console.log('List rendering');
  return (<div>
    <ul>
      {
        props.list.map(item => (
          <li key={item.objectID}>
            <Item item={item}/>
          </li>
        )
        )
      }
    </ul>
  </div>
  )
}



const Item = ({ item } : ItemProps) => (
  <>
        <span>
          
            <a href={item.url}>{item.title}</a>
          </span>
          <span>{item.author}</span>
          <span>{item.num_comments}</span>
          <span>{item.points}</span>
    </>
)


export default App
