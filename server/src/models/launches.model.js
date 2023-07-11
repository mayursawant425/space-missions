const axios = require("axios");
const launches = require("./launches.mongo");
const planets = require("./planets.mongo");


const DEFAULT_FLIGHT_NUMBER = 100;

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

async function populateLaunches() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1
          }
        },
        {
          path: "payloads",
          select: {
            customers: 1
          }
        }
      ]
    }
  });

  if (response.status !== 200) {
    throw new Error("Launch data download failed");
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc.payloads;
    const customers = payloads.flatMap((payload) => payload.customers);

    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers: customers
    };
    await saveLaunch(launch);
  }
}

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function loadLaunchesData() {
  console.log("Downloading launch data");

  const firstLaunch = await findLaunch(
    {
      flightNumber: 1,
      rocket: "Falcon 1",
      mission: "FalconSat"
    }
  );
  if (firstLaunch) {
    console.log("Launch data already downloaded");
    return;
  }
  await populateLaunches();
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
  return await launches.find({}, {
    _id: 0,
    __v: 0
  })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function saveLaunch(launch) {
  try {
    await launches.updateOne({
      flightNumber: launch.flightNumber
    }, launch, {
      upsert: true
    });
  } catch (err) {
    console.error(err);
  }
}

async function addNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  });
  if (!planet) {
    throw new Error("No matching planet found");
  }

  const newFlightNumber = await getLatestFlightNumber() + 1;
  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
  });
  await saveLaunch(newLaunch);
}

async function existsLaunchWithID(launchId) {
  console.log(await launches.findOne({
    flightNumber: 1
  }));
  return await launches.findOne({
    flightNumber: launchId
  });
}

async function abortLaunchById(launchId) {
  const aborted = await launches.updateOne({
    flightNumber: launchId
  }, {
    upcoming: false,
    success: false
  });

  return aborted.ok === 1 && aborted.nModified === 1;
}

module.exports = {
  loadLaunchesData,
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithID,
  abortLaunchById
};