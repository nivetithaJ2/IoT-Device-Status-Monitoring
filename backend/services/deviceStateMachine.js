
const transitions = {
  Registered: {
    MESSAGE_RECEIVED: "Active",
    FAILURE_LIMIT_REACHED: "Disconnected"
  },

  Active: {
    MESSAGE_RECEIVED: "Active",
    FAILURE_LIMIT_REACHED: "Disconnected"
  },

  Disconnected: {
    MESSAGE_RECEIVED: "Active",
    FAILURE_LIMIT_REACHED: "Disconnected"
  }
};

function getNextState(currentState, event) {
  return transitions[currentState]?.[event] || currentState;
}

module.exports = getNextState;
