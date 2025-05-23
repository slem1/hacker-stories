import {
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import App, { Item, SearchForm, storiesReducer } from './App';

vi.mock('axios');


const storyOne = {
    title: 'React',
    url: 'https://react.dev/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
};

const storyTwo = {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
};

const stories = [storyOne, storyTwo];


describe('storiesReducer', () => {
    it('remove a story from all stories', () => {

        const state = { data: stories, isLoading: false, isError: false };
        const action = { type: 'REMOVE_STORY', payload: storyOne }

        const newState = storiesReducer(state, action);

        const expectedState = { data: [storyTwo], isLoading: false, isError: false };

        expect(newState).toStrictEqual(expectedState);

    });
});

describe('Item', () => {
    it('renders all properties', () => {

        render(<Item item={storyOne}></Item>);

        screen.debug();

        expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
        expect(screen.getByText('React')).toHaveAttribute('href', 'https://react.dev/');
    });

    it('clicking the dismiss button calls the callback handler', () => {
        const handleRemoveItem = vi.fn()

        render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />);

        fireEvent.click(screen.getByRole('button'));

        expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    })
});

describe('SearchForm', () => {

    const searchFormProps = {
        searchTerm: 'React',
        onSearchInput: vi.fn(),
        searchAction: vi.fn()
    };

    it('renders the input field with its value', () => {
        render(<SearchForm {...searchFormProps} />)

        screen.debug();

        expect(screen.getByDisplayValue('React')).toBeInTheDocument();

    });

    it('renders the correct label', () => {
        render(<SearchForm {...searchFormProps} />)

        expect(screen.getByLabelText(/Search/)).toBeInTheDocument();

    });

    it('calls onSearchInput on input field change', () => {

        render(<SearchForm {...searchFormProps} />);

        fireEvent.change(screen.getByDisplayValue('React'), { target: { value: 'Redux' } });

        expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
    });

    it('calls searchAction button submit click', () => {

        render(<SearchForm {...searchFormProps} />);

        fireEvent.click(screen.getByRole('button'))

        expect(searchFormProps.searchAction).toHaveBeenCalledTimes(1);
    });
})

describe('App', () => {
    it('succeeds fetching data', async () => {
        const promise = Promise.resolve({
            data: {
                hits: stories
            }
        });

        axios.get.mockImplementationOnce(() => promise);

        render(<App />);

        screen.debug();

        expect(screen.queryByText(/Loading/)).toBeInTheDocument();

        await waitFor(async () => await promise);
        screen.debug();

        expect(screen.queryByText(/Loading/)).toBeNull();

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Redux')).toBeInTheDocument();
        expect(screen.getAllByText('Dismiss').length).toBe(2);
    })

    it('fails fetching data', async () => {
        const promise = Promise.reject();

        axios.get.mockImplementationOnce(() => promise);

        render(<App />)

        expect(screen.getByText(/Loading/)).toBeInTheDocument();

        try {
            await waitFor(async () => await promise);
        } catch (error) {
            expect(screen.queryByText(/Loading/)).toBeNull();
            expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
        }
    })

    it('remove a story', async () => {
        const promise = Promise.resolve({
            data: {
                hits: stories,
            },
        });
        axios.get.mockImplementationOnce(() => promise);
        render(<App />);
        await waitFor(async () => await promise);
        expect(screen.getAllByText('Dismiss').length).toBe(2);
        expect(screen.getByText('Jordan Walke')).toBeInTheDocument();

        fireEvent.click(screen.getAllByText('Dismiss')[0]);

        expect(screen.getAllByText('Dismiss').length).toBe(1);
        expect(screen.queryByText('Jordan Walke')).toBe(null);

    });

})

describe('snapshot', () => {

    const searchFormProps = {
        searchTerm: 'React',
        onSearchInput: vi.fn(),
        searchAction: vi.fn()
    };

    it('renders a snapshot', () => {
        const { container } = render(<SearchForm {...searchFormProps} />);
        expect(container.firstChild).toMatchSnapshot();

    })

})