import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import List "mo:base/List";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";

actor HealthSystem {
  // Types
  type UserId = Text;
  type Symptom = Text;
  type TestResult = (Text, Text); // (TestName, Result)
  type MedicalHistory = Text;
  type DrugRecommendation = {
    medicineName: Text;
    effectiveness: Float;
    affordabilityScore: Float;
    alternativeOptions: List.List<Text>;
  };

  type UserProfile = {
    id: UserId;
    name: Text;
    age: Nat;
    financialStatus: Text;
    medicalHistory: List.List<MedicalHistory>;
    previousTests: List.List<TestResult>;
    symptoms: List.List<Symptom>;
  };

  // Stable storage for upgrade persistence
  private stable var userEntries : [(UserId, UserProfile)] = [];
  private var users : HashMap.HashMap<UserId, UserProfile> = HashMap.HashMap(10, Text.equal, Text.hash);

  // Mock LLM actor reference
  private let mockLLM = actor "bkyz2-fmaaa-aaaaa-qaaaq-cai" : actor {
    generate(prompt : Text) : async Text;
  };

  // System upgrade hooks
  system func preupgrade() {
    userEntries := Iter.toArray(users.entries());
  };

  system func postupgrade() {
    users := HashMap.fromIter(userEntries.vals(), 10, Text.equal, Text.hash);
    userEntries := [];
  };

  // Helper function to convert List<Text> to Text
  private func listToText(list: List.List<Text>) : Text {
    let arr = List.toArray(list);
    if (arr.size() == 0) { return ""; };
    Array.foldLeft<Text, Text>(arr, "", func (acc, x) { acc # (if (acc == "") { "" } else { ", " }) # x });
  };

  // User Registration
  public shared func createUser(id: UserId, name: Text, age: Nat, financialStatus: Text) : async Text {
    let existingUser = users.get(id);
    switch (existingUser) {
      case (?_) { return "User already exists!"; };
      case null {
        let user : UserProfile = {
          id = id;
          name = name;
          age = age;
          financialStatus = financialStatus;
          medicalHistory = List.nil();
          previousTests = List.nil();
          symptoms = List.nil();
        };
        users.put(id, user);
        return "User created successfully!";
      };
    };
  };

  // Add Medical History
  public shared func addMedicalHistory(userId: UserId, history: MedicalHistory) : async Text {
    let userOpt = users.get(userId);
    switch (userOpt) {
      case (?user) {
        let updatedHistory = List.push(history, user.medicalHistory);
        let updatedUser = { user with medicalHistory = updatedHistory };
        users.put(userId, updatedUser);
        return "Medical history updated!";
      };
      case null { return "User not found!"; };
    };
  };

  // Log Symptoms
  public shared func addSymptoms(userId: UserId, newSymptoms: [Symptom]) : async Text {
    let userOpt = users.get(userId);
    switch (userOpt) {
      case (?user) {
        var updatedSymptoms = user.symptoms;
        for (symptom in newSymptoms.vals()) {
          updatedSymptoms := List.push(symptom, updatedSymptoms);
        };
        let updatedUser = { user with symptoms = updatedSymptoms };
        users.put(userId, updatedUser);
        return "Symptoms added!";
      };
      case null { return "User not found!"; };
    };
  };

  // Save Test Results
  public shared func addTestResult(userId: UserId, testName: Text, result: Text) : async Text {
    let userOpt = users.get(userId);
    switch (userOpt) {
      case (?user) {
        let newTest : TestResult = (testName, result);
        let updatedTests = List.push(newTest, user.previousTests);
        let updatedUser = { user with previousTests = updatedTests };
        users.put(userId, updatedUser);
        return "Test result added!";
      };
      case null { return "User not found!"; };
    };
  };

  // Get Drug Recommendation (Mock AI)
  public shared func getDrugRecommendation(userId: UserId) : async ?DrugRecommendation {
    let userOpt = users.get(userId);
    switch (userOpt) {
      case (?user) {
        // Construct a prompt from user data
        let symptomsText = listToText(user.symptoms);
        let historyText = listToText(user.medicalHistory);
        let prompt = "User: " # user.name # ", Age: " # Nat.toText(user.age) # 
                     ", Financial Status: " # user.financialStatus # 
                     ", Symptoms: " # symptomsText # 
                     ", History: " # historyText;

        // Mock AI call
        let _mockResponse = await mockLLM.generate(prompt);
        let recommendation : DrugRecommendation = {
          medicineName = "Metformin";
          effectiveness = 95.0;
          affordabilityScore = if (user.financialStatus == "Low-Income") { 80.0 } else { 90.0 };
          alternativeOptions = List.fromArray(["Glipizide", "Insulin"]);
        };
        return ?recommendation;
      };
      case null { return null; };
    };
  };

  // Retrieve User Data
  public query func getUserData(userId: UserId) : async ?UserProfile {
    users.get(userId)
  };

  // Chatbot Interaction (Mock)
  public shared func askHealthQuestion(userId: UserId, question: Text) : async Text {
    let userOpt = users.get(userId);
    switch (userOpt) {
      case (?user) {
        let prompt = "User: " # user.name # ", Question: " # question # 
                     ", Medical History: " # listToText(user.medicalHistory);
        let response = await mockLLM.generate(prompt);
        return response;
      };
      case null { return "User not found!"; };
    };
  };
};