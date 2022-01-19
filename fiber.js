const fiber = {
  tag: 3,
  key: null,
  elementType: null,
  type: null,
  stateNode: null,
  return: null,
  child: null,
  sibling: null,
  index: 0,
  ref: null,
  pendingProps: null, // newProps
  memoizedProps: null, // oldProps
  updateQueue: {
    baseState: { element: null },
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: {
      pending: null,
      interleaved: null,
      lanes: 0,
    },
    effects: null,
  },
  memoizedState: { element: null },
  dependencies: null,
  mode: 0,
  flags: 0,
  subtreeFlags: 0,
  deletions: null,
  lanes: 0,
  childLanes: 0,
  alternate: null,
};
const uq = {
  updateQueue: {
    shared: {
      pending: null,
    },
  },
};
const updateQueue = uq.updateQueue;
const shared = updateQueue.shared;
const pending = shared.pending;
const up = {
  a: 1,
  b: 2,
  next: null,
};

up.next = up;
shared.pending = up;
console.log(uq);
const second = (uq) => {
  const updateQueue = uq.updateQueue;
  const shared = updateQueue.shared;
  const pending = shared.pending;
  up.next = pending.next;
  pending.next = up;
  shared.next = up;
  console.log(uq);
};
setTimeout(() => {
  second(uq);
}, 1000);
