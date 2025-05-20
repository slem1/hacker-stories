
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

  const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

  const useStorageState = (key: string, initialState: string): [any, any] => {
    const [value, setValue] = React.useState(localStorage.getItem(key) ?? initialState);

    React.useEffect(() => {
      localStorage.setItem(key, value);
    }, [key, value])

    return [value, setValue];
  };

  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');


  type StoriesState = {
    data: Story[],
    isLoading: boolean,
    isError: boolean
  }

  type StoriesFetchInitAction = {
    type: 'STORIES_FETCH_INIT';
  };

  type StoriesFetchSuccessAction = {
    type: 'STORIES_FETCH_SUCCESS';
    payload: Story[];
  };

  type StoriesFetchFailureAction = {
    type: 'STORIES_FETCH_FAILURE';
  };

  type StoriesRemoveAction = {
    type: 'REMOVE_STORY';
    payload: Story;
  };


  type StoriesAction = StoriesFetchSuccessAction | StoriesRemoveAction | StoriesFetchInitAction | StoriesFetchFailureAction;

  const storiesReducer = (state: StoriesState, action: StoriesAction) => {
    switch (action.type) {
      case 'STORIES_FETCH_INIT':
        return { ...state, isLoading: true, isError: false };
      case 'STORIES_FETCH_SUCCESS':
        return { ...state, data: action.payload, isLoading: false, isError: false };
      case 'STORIES_FETCH_FAILURE':
        return { ...state, isLoading: false, isError: true }
      case 'REMOVE_STORY':
        return {
          ...state, data: state.data.filter(story => action.payload.objectID !== story.objectID),
        };
      default:
        throw new Error();
    }
  }

  const [stories, dispatchStories] = React.useReducer(storiesReducer, { data: [], isLoading: false, isError: false });

  const handleFetchStories = React.useCallback(() => {

    if (!searchTerm) return;

    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    fetch(`${API_ENDPOINT}${searchTerm}`)
      .then((response) => response.json())
      .then((result) => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.hits
        });
      })
      .catch(() => {
        dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
      });
  }, [searchTerm])

  React.useEffect(() => handleFetchStories(), [handleFetchStories]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

  const handleRemoveStory = (item: Story) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    });
  }

  return (<div>

    <h1>My Hacker Stories</h1>

    <InputWithLabel id="search" value={searchTerm} onInputChange={handleSearch} isFocused>
      Search:
    </InputWithLabel>

    <hr />
    {stories.isError && <p>Something went wrong ...</p>}

    {stories.isLoading ? <p>Loading ... </p> : <List list={stories.data} onRemoveItem={handleRemoveStory} />}

  </div>
  )
}

interface ListProps {
  list: Story[],
  onRemoveItem: (item: Story) => void
}

interface ItemProps {
  item: Story,
  onRemoveItem: (item: Story) => void
}

interface SearchProps {
  onSearch: (event: ChangeEvent<HTMLInputElement>) => void
  search: string
}

interface InputWithLabelProps {
  id: string,
  value: string,
  type?: string,
  children: React.ReactNode,
  isFocused: boolean,
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const InputWithLabel = ({ id, value, type = 'text', children, isFocused, onInputChange }: InputWithLabelProps) => {

  //A
  const inputRef = React.useRef<HTMLInputElement>(null);

  //C
  React.useEffect(() => {
    //only if isFocused and ref.current has been set
    if (isFocused && inputRef.current) {
      //D
      inputRef.current.focus();
    }
  }, [isFocused])

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      {/* B */}
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange} />
    </>
  )
}


const List = ({ list, onRemoveItem }: ListProps) => {

  return (<div>
    <ul>
      {list.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      ))}
    </ul>
  </div>
  )
}



const Item = ({ item, onRemoveItem }: ItemProps
) => {
  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <button key={item.objectID} value={item.objectID} onClick={() => onRemoveItem(item)}>Dismiss</button>
    </li>
  );
}

export default App
