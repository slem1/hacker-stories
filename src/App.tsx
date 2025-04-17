
import { ChangeEvent } from 'react';
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

  return (<div>

    <h1>My Hacker Stories</h1>

    <Search />

    <hr />

    <List list={stories} />
  </div>
  )
}

interface ListProps {
  list: Story[]
}

interface ItemProps {
  item: Story
}


const Search = () => {

  console.log('Search rendering');

  const [searchTerm, setSearchTerm] = React.useState('');  

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm (event.target.value);
  }

  return (<div>
    <label htmlFor='search'>Search</label>
    <input id='search' type='text' onChange={handleChange} />

    <p>
    searching for <strong>{searchTerm}</strong>
    </p>

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
