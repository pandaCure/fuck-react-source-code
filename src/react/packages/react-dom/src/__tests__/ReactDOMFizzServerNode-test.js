/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 * @jest-environment node
 */

'use strict';

let Stream;
let React;
let ReactDOMFizzServer;
let Suspense;

describe('ReactDOMFizzServer', () => {
  beforeEach(() => {
    jest.resetModules();
    React = require('react');
    if (__EXPERIMENTAL__) {
      ReactDOMFizzServer = require('react-dom/unstable-fizz');
    }
    Stream = require('stream');
    Suspense = React.Suspense;
  });

  function getTestWritable() {
    const writable = new Stream.PassThrough();
    writable.setEncoding('utf8');
    const output = {result: '', error: undefined};
    writable.on('data', chunk => {
      output.result += chunk;
    });
    writable.on('error', error => {
      output.error = error;
    });
    const completed = new Promise(resolve => {
      writable.on('finish', () => {
        resolve();
      });
      writable.on('error', () => {
        resolve();
      });
    });
    return {writable, completed, output};
  }

  const theError = new Error('This is an error');
  function Throw() {
    throw theError;
  }
  const theInfinitePromise = new Promise(() => {});
  function InfiniteSuspend() {
    throw theInfinitePromise;
  }

  // @gate experimental
  it('should call pipeToNodeWritable', () => {
    const {writable, output} = getTestWritable();
    const {startWriting} = ReactDOMFizzServer.pipeToNodeWritable(
      <div>hello world</div>,
      writable,
    );
    startWriting();
    jest.runAllTimers();
    expect(output.result).toBe('<div>hello world</div>');
  });

  // @gate experimental
  it('should start writing after startWriting', () => {
    const {writable, output} = getTestWritable();
    const {startWriting} = ReactDOMFizzServer.pipeToNodeWritable(
      <div>hello world</div>,
      writable,
    );
    jest.runAllTimers();
    // First we write our header.
    output.result +=
      '<!doctype html><html><head><title>test</title><head><body>';
    // Then React starts writing.
    startWriting();
    expect(output.result).toBe(
      '<!doctype html><html><head><title>test</title><head><body><div>hello world</div>',
    );
  });

  // @gate experimental
  it('should error the stream when an error is thrown at the root', async () => {
    const {writable, output, completed} = getTestWritable();
    ReactDOMFizzServer.pipeToNodeWritable(
      <div>
        <Throw />
      </div>,
      writable,
    );

    // The stream is errored even if we haven't started writing.

    await completed;

    expect(output.error).toBe(theError);
    expect(output.result).toBe('');
  });

  // @gate experimental
  it('should error the stream when an error is thrown inside a fallback', async () => {
    const {writable, output, completed} = getTestWritable();
    const {startWriting} = ReactDOMFizzServer.pipeToNodeWritable(
      <div>
        <Suspense fallback={<Throw />}>
          <InfiniteSuspend />
        </Suspense>
      </div>,
      writable,
    );
    startWriting();

    await completed;

    expect(output.error).toBe(theError);
    expect(output.result).toBe('');
  });

  // @gate experimental
  it('should not error the stream when an error is thrown inside suspense boundary', async () => {
    const {writable, output, completed} = getTestWritable();
    const {startWriting} = ReactDOMFizzServer.pipeToNodeWritable(
      <div>
        <Suspense fallback={<div>Loading</div>}>
          <Throw />
        </Suspense>
      </div>,
      writable,
    );
    startWriting();

    await completed;

    expect(output.error).toBe(undefined);
    expect(output.result).toContain('Loading');
  });

  // @gate experimental
  it('should not attempt to render the fallback if the main content completes first', async () => {
    const {writable, output, completed} = getTestWritable();

    let renderedFallback = false;
    function Fallback() {
      renderedFallback = true;
      return 'Loading...';
    }
    function Content() {
      return 'Hi';
    }
    const {startWriting} = ReactDOMFizzServer.pipeToNodeWritable(
      <Suspense fallback={<Fallback />}>
        <Content />
      </Suspense>,
      writable,
    );
    startWriting();

    await completed;

    expect(output.result).toContain('Hi');
    expect(output.result).not.toContain('Loading');
    expect(renderedFallback).toBe(false);
  });

  // @gate experimental
  it('should be able to complete by aborting even if the promise never resolves', async () => {
    const {writable, output, completed} = getTestWritable();
    const {startWriting, abort} = ReactDOMFizzServer.pipeToNodeWritable(
      <div>
        <Suspense fallback={<div>Loading</div>}>
          <InfiniteSuspend />
        </Suspense>
      </div>,
      writable,
    );
    startWriting();

    jest.runAllTimers();

    expect(output.result).toContain('Loading');

    abort();

    await completed;

    expect(output.error).toBe(undefined);
    expect(output.result).toContain('Loading');
  });
});