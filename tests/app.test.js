import test from "node:test";
import assert from "node:assert/strict";

import { classifyBloodPressure, classifyGlucose, summarizeReadings } from "../app.js";

test("classifyGlucose detects low, in-range and high values", () => {
  assert.equal(classifyGlucose(65), "low");
  assert.equal(classifyGlucose(100), "in_range");
  assert.equal(classifyGlucose(190), "high");
});

test("classifyBloodPressure detects major hypertension categories", () => {
  assert.equal(classifyBloodPressure(118, 76), "normal");
  assert.equal(classifyBloodPressure(125, 77), "elevated");
  assert.equal(classifyBloodPressure(132, 85), "high_stage_1");
  assert.equal(classifyBloodPressure(145, 95), "high_stage_2");
  assert.equal(classifyBloodPressure(182, 110), "crisis");
});

test("summarizeReadings returns rounded average and limits", () => {
  assert.deepEqual(summarizeReadings([70, 100, 120]), {
    average: 96.7,
    min: 70,
    max: 120,
  });
  assert.deepEqual(summarizeReadings([]), {
    average: 0,
    min: 0,
    max: 0,
  });
});
