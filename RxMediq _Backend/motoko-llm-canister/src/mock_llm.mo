actor MockLLM {
  public func generate(prompt : Text) : async Text {
    return "Mock response to: " # prompt;
  };
};