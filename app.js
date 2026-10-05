const glucoseEntries = [];
const pressureEntries = [];

export function classifyGlucose(value) {
  if (value < 70) {
    return "low";
  }
  if (value <= 180) {
    return "in_range";
  }
  return "high";
}

export function classifyBloodPressure(systolic, diastolic) {
  if (systolic >= 180 || diastolic >= 120) {
    return "crisis";
  }
  if (systolic >= 140 || diastolic >= 90) {
    return "high_stage_2";
  }
  if (systolic >= 130 || diastolic >= 80) {
    return "high_stage_1";
  }
  if (systolic >= 120 && diastolic < 80) {
    return "elevated";
  }
  return "normal";
}

export function summarizeReadings(values) {
  if (values.length === 0) {
    return { average: 0, min: 0, max: 0 };
  }
  const total = values.reduce((sum, value) => sum + value, 0);
  return {
    average: Number((total / values.length).toFixed(1)),
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

function formatGlucoseStatus(status) {
  if (status === "low") return "Hypoglycémie";
  if (status === "high") return "Hyperglycémie";
  return "Objectif atteint";
}

function formatPressureStatus(status) {
  const labels = {
    normal: "Normale",
    elevated: "Élevée",
    high_stage_1: "Hypertension stade 1",
    high_stage_2: "Hypertension stade 2",
    crisis: "Crise hypertensive",
  };
  return labels[status];
}

function renderList(container, entries, formatter) {
  container.innerHTML = "";
  if (entries.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "Aucune mesure enregistrée";
    container.appendChild(emptyItem);
    return;
  }
  entries.forEach((entry) => {
    const item = document.createElement("li");
    item.textContent = formatter(entry);
    container.appendChild(item);
  });
}

function initApp() {
  const glucoseForm = document.querySelector("#glucose-form");
  const pressureForm = document.querySelector("#pressure-form");
  const glucoseList = document.querySelector("#glucose-list");
  const pressureList = document.querySelector("#pressure-list");
  const glucoseSummary = document.querySelector("#glucose-summary");
  const pressureSummary = document.querySelector("#pressure-summary");

  const updateGlucose = () => {
    const values = glucoseEntries.map((entry) => entry.value);
    const summary = summarizeReadings(values);
    glucoseSummary.textContent = `Moyenne: ${summary.average} mg/dL | Min: ${summary.min} | Max: ${summary.max}`;
    renderList(
      glucoseList,
      glucoseEntries,
      (entry) => `${entry.date} — ${entry.value} mg/dL (${formatGlucoseStatus(entry.status)})`,
    );
  };

  const updatePressure = () => {
    const systolicValues = pressureEntries.map((entry) => entry.systolic);
    const diastolicValues = pressureEntries.map((entry) => entry.diastolic);
    const systolicSummary = summarizeReadings(systolicValues);
    const diastolicSummary = summarizeReadings(diastolicValues);
    pressureSummary.textContent = `Moyenne: ${systolicSummary.average}/${diastolicSummary.average} mmHg | Min: ${systolicSummary.min}/${diastolicSummary.min} | Max: ${systolicSummary.max}/${diastolicSummary.max}`;
    renderList(
      pressureList,
      pressureEntries,
      (entry) => `${entry.date} — ${entry.systolic}/${entry.diastolic} mmHg (${formatPressureStatus(entry.status)})`,
    );
  };

  glucoseForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(glucoseForm);
    const date = String(formData.get("date"));
    const value = Number(formData.get("value"));

    if (!date || Number.isNaN(value) || value <= 0) {
      return;
    }

    glucoseEntries.unshift({
      date,
      value,
      status: classifyGlucose(value),
    });
    glucoseForm.reset();
    updateGlucose();
  });

  pressureForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(pressureForm);
    const date = String(formData.get("date"));
    const systolic = Number(formData.get("systolic"));
    const diastolic = Number(formData.get("diastolic"));

    if (!date || Number.isNaN(systolic) || Number.isNaN(diastolic) || systolic <= 0 || diastolic <= 0) {
      return;
    }

    pressureEntries.unshift({
      date,
      systolic,
      diastolic,
      status: classifyBloodPressure(systolic, diastolic),
    });
    pressureForm.reset();
    updatePressure();
  });

  updateGlucose();
  updatePressure();
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", initApp);
}
