'use strict';

const express = require( 'express' );

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
const knex = require( '../knex' );

const {
  camelizeKeys,
  decamelizeKeys
} = require( 'humps' );
const boom = require( 'boom' );

router.get( '/books', function( req, res, next ) {
  // send all books ordered by title in response body
  knex( 'books' )
    .orderBy( 'title' )
    .then( ( books ) => {
      var booksResponse = camelizeKeys( books );
      console.log( books );
      console.log( booksResponse );
      res.type( 'json' );
      res.send( booksResponse );

    } )
    .catch( ( err ) => {
      next( err );
    } );
} );

router.get( '/books/:id', function( req, res, next ) {
  // query db for requested id
  knex( 'books' )
    .where( 'id', req.params.id )
    .first()
    .then( ( books ) => {
      if ( !books ) {
        return next();
      }
      // send selected id as response
      var booksResponse = camelizeKeys( books );
      res.type( 'json' );
      res.send( booksResponse );
    } )
    .catch( ( err ) => {
      next( err );
    } );
} );

router.post( '/books', function() {
  // validate request body
  if ( !name || !name.trim() ) {
    next( boom.create( 400, "invalid request body" ) );
  }
  // insert parsed req.body into books db
  // select and send new row as response with id
} );

router.patch( '/books/:id', function() {
  // update books db at specified id for columns in req.body
  // send updated db entry as response
  res.set( 'Content-Type', 'application/json' );
  res.send();
} );

router.delete( '/books/:id', function() {
  // delete row at specified id
  // return deleted item
  res.set( 'Content-Type', 'application/json' );
  res.send();
} );


module.exports = router;
