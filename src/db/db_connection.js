import SQLite from 'react-native-sqlite-storage';
const db = SQLite.openDatabase({
    name: "mainDb",
    location: "default"
}, async () => { 

    db.transaction(async (tx) => {
        await tx.executeSql(
            "CREATE TABLE IF NOT EXISTS "
            + "TRIP"
            + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, destination TEXT, placeId TEXT,name TEXT,startDate TEXT,endDate TEXT);"
        );
        await tx.executeSql(
            // "DROP TABLE PLAN;",
            "CREATE TABLE IF NOT EXISTS "
            + "PLAN"
            + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, event TEXT,venue TEXT,startDate TEXT,endDate TEXT, TripID int, FOREIGN KEY (TripID) REFERENCES TRIP(ID));",
        [],(tx, results) => {
        }, (error)=>{
            console.log('Failed to select:', error);
        });


        await tx.executeSql(
            // "DROP TABLE Destination;",
            "CREATE TABLE IF NOT EXISTS "
            + "Destination"
            + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, image TEXT,name TEXT,long TEXT,lat TEXT,fav INTEGER DEFAULT 0, custom INTEGER DEFAULT 0, TripID int, FOREIGN KEY (TripID) REFERENCES TRIP(ID));",
        [],(tx, results) => {
        }, (error)=>{
            console.log('Failed to select:', error);
        });

        await tx.executeSql(
            "CREATE TABLE IF NOT EXISTS "
            + "CHECKLIST"
            + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, item TEXT,checked INTEGER, TripID int, FOREIGN KEY (TripID) REFERENCES TRIP(ID));",
        [],(tx, results) => {
        }, (error)=>{
            console.log('Failed to select:', error);
        });
    })
}, error => { console.log(error) })



const dbConnection = {
    createtable: async function(query){
        return new Promise(async function(resolve, reject) {
            return await db.transaction(async (tx) => {
                await tx.executeSql(
                    query
                );
                resolve("done")
            })
        })
  
    },
    insert: async function (query, data) {
        return await db.transaction(async (tx) => {
            await tx.executeSql(
                query,
                data,(tx, results) => {
                    // console.log("insert")
                }, (error)=>{
                    console.log('Failed to select:', error);
                }
            )
        })
    },
    update: async function (query, data) {
        return await db.transaction(async (tx) => {
            await tx.executeSql(
                query,
                data, (tx, results) => {
                }, (error)=>{
                    console.log('Failed to select:', error);
                }
            )
        })
    },
    select: async function (query, data) {
        return new Promise(async function(resolve, reject) {
            await db.transaction(async (tx) => {
                await tx.executeSql(query, data, (tx, results) => {
                    resolve(results)
                }, (error)=>{
                    console.log('Failed to select:', error);
                })
            })
          });
    },
    delete: async function (query, data) {
        return new Promise(async function(resolve, reject) {
            await db.transaction(async (tx) => {
                await tx.executeSql(query, data, (tx, results) => {
                    resolve(results)
                })
            })
          });
    }
}

export default dbConnection;