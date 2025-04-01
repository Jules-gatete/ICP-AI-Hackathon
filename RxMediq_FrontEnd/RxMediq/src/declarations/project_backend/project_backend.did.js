export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    createUser: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Nat, IDL.Text],
      [IDL.Text],
      []
    ),
    getUserData: IDL.Func(
      [IDL.Text],
      [IDL.Variant({ ok: IDL.Any, err: IDL.Text })],
      ['query']
    ),
    addMedicalHistory: IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
    addSymptoms: IDL.Func([IDL.Text, IDL.Vec(IDL.Text)], [IDL.Text], []),
    addTestResult: IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Text], []),
    getDrugRecommendation: IDL.Func(
      [IDL.Text],
      [
        IDL.Opt(
          IDL.Record({
            medicineName: IDL.Text,
            effectiveness: IDL.Float64,
            affordabilityScore: IDL.Float64,
            alternativeOptions: IDL.Vec(IDL.Text),
          })
        ),
      ],
      ['query']
    ),
  });
};