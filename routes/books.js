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

router.post( '/books', function( req, res, next ) {
  // validate request body
  if ( !req.body.title || !req.body.title.trim() ) {
    next( boom.create( 400, "invalid request body" ) );
  }
  // insert parsed req.body into books db
  knex( 'books' )
    .insert( decamelizeKeys( req.body ), '*' )
    .then( ( books ) => {
      var response = camelizeKeys( books[ 0 ] );
      res.type( 'json' );
      res.send( response );
    } )
    // select and send new row as response with id
} );

router.patch( '/books/:id', function( req, res, next ) {
  // update books db at specified id for columns in req.body
  knex( 'books' )
    .where( 'id', req.params.id )
    .first()
    .then( ( books ) => {
      if ( !books ) {
        return next();
      }
      return knex( 'books' )
        .update( decamelizeKeys( req.body ), '*' )
        .where( 'id', req.params.id );
    } )
    // send updated db entry as response
    .then( ( books ) => {
      var response = camelizeKeys( books[ 0 ] );
      res.type( 'json' );
      res.send( response );
    } )
    .catch( ( err ) => {
      next( err );
    } );
} );

router.delete( '/books/:id', function( req, res, next ) {
  // delete row at specified id
  let book;

  knex( 'books' )
    .where( 'id', req.params.id )
    .first()
    .then( ( row ) => {
      if ( !row ) {
        return next();
      }

      book = row;

      return knex( 'books' )
        .del()
        .where( 'id', req.params.id );
    } )
    // return deleted item
    .then( () => {
      delete book.id;
      var response = camelizeKeys( book );
      res.type( 'json' );
      res.send( response );
    } )
    .catch( ( err ) => {
      next( err );
    } );
} );


module.exports = router;
