import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

function findCategory(categoryId) {
  return categoriesFromServer.find(
    category => category.id === categoryId,
  ) || null;
}

function findUser(ownerId) {
  return usersFromServer.find(
    user => user.id === ownerId,
  ) || null;
}

const ServerProducts = productsFromServer.map(product => ({
  ...product,
  category: findCategory(product.categoryId),
}));

const products = ServerProducts.map(product => ({
  ...product,
  user: findUser(product.category.ownerId),
}));

function prepareProducts(givenProducts, {
  activeUser,
  selectedCategory,
  query,
}) {
  let preparedProducts = givenProducts;

  if (activeUser) {
    preparedProducts = preparedProducts.filter(
      product => product.user.name === activeUser,
    );
  }

  if (selectedCategory) {
    preparedProducts = preparedProducts.filter(
      product => product.category.title === selectedCategory,
    );
  }

  if (query) {
    const lowerQuery = query.toLowerCase().trim();
    const upperQuery = query.toUpperCase().trim();

    preparedProducts = preparedProducts.filter(
      product => product.name.toLowerCase().includes(lowerQuery)
        || product.name.toUpperCase().includes(upperQuery),
    );
  }

  return preparedProducts;
}

export const App = () => {
  const [activeUser, setActiveUser] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [query, setQuery] = useState('');
  const visibleProducts = prepareProducts(products, {
    activeUser,
    selectedCategory,
    query,
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setActiveUser('')}
                className={cn({ 'is-active': !activeUser })}
              >
                All
              </a>

              {usersFromServer.map(
                user => (
                  <a
                    key={user.id}
                    data-cy="FilterUser"
                    href="#/"
                    onClick={() => setActiveUser(user.name)}
                    className={cn({ 'is-active': activeUser === user.name })}
                  >
                    {user.name}
                  </a>
                ),
              )}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.currentTarget.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => {
                        setQuery('');
                      }}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn({
                  'button is-success mr-6': !selectedCategory,
                  'button is-success mr-6 is-outlined': selectedCategory,
                })}
                onClick={() => {
                  setSelectedCategory('');
                }}
              >
                All
              </a>

              {categoriesFromServer.map(
                category => (
                  <a
                    key={category.id}
                    data-cy="Category"
                    className={cn({
                      'button mr-2 my-1': true,
                      'button mr-2 my-1 is-info':
                        selectedCategory === category.title,
                    })}
                    href="#/"
                    onClick={() => setSelectedCategory(category.title)}
                  >
                    {category.title}
                  </a>
                ),
              )}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setActiveUser('');
                  setSelectedCategory('');
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >

            {!visibleProducts.length ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            ) : (
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>
            )}

            <tbody>
              {visibleProducts.map(product => (
                <tr
                  data-cy="Product"
                  key={product.id}
                >
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">
                    {`${product.category.icon} - ${product.category.title}`}
                  </td>

                  <td
                    data-cy="ProductUser"
                    className={cn({
                      'has-text-link': true,
                      'has-text-danger': product.user.sex === 'f',
                    })}
                  >
                    {product.user.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
