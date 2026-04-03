import api from "./api";

export const getQuickTest = async () => {
  const res = await api.get("/test/quick/");
  return res.data;
};

export const submitQuickTest = async (answers) => {
  const res = await api.post("/test/quick/submit/", {
    answers,
  });
  return res.data;
};

export const getSkillTest = async () => {
  const res = await api.get("/test/skill/");
  return res.data;
};

export const submitSkillTest = async (answers, skill) => {
  const res = await api.post("/test/test/skill/submit/", {
    answers,
    skill,
  });
  return res.data;
};

export const getPredictions = async () => {
  const res = await api.get("/predict/");
  return res.data;
};