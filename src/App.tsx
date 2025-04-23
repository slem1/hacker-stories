
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

  const useStorageState = (key: string, initialState: string) : [any, any] => {
    const [value, setValue] = React.useState(localStorage.getItem(key) ?? initialState);

    React.useEffect(() => {
      localStorage.setItem(key, value);
    }, [key, value])

    return [value, setValue];
  };

  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

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
  item: Story
}

interface SearchProps {
  onSearch: (event: ChangeEvent<HTMLInputElement>) => void
  search: string
}


const Search = ({ search, onSearch }: SearchProps) => {

  return (<> //fragment
    <label htmlFor='search'>Search</label>
    <input id='search' type='text' value={search} onChange={onSearch} />
  </>
  );
}

const List = ({ list }: ListProps) => {

  return (<div>
    <ul>
      {list.map((item) => (
        <Item item={item} />
      ))}
    </ul>
  </div>
  )
}



const Item = ({ item }: ItemProps
) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
  </li>
)


export default App
