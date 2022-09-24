import SQLite from 'react-native-sqlite-storage';
const db = SQLite.openDatabase({
    name: "mainDb",
    location: "default"
}, async () => { 

    db.transaction(async (tx) => {
        await tx.executeSql(
            "CREATE TABLE IF NOT EXISTS "
            + "TRIP"
            + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, destination TEXT,destinationImage TEXT, placeId TEXT,name TEXT,startDate TEXT,endDate TEXT);"
        );

        
        await tx.executeSql(
            // "DROP TABLE PLAN;",
            "CREATE TABLE IF NOT EXISTS "
            + "PLAN"
            + "(ID INTEGER PRIMARY KEY AUTOINCREMENT,ALERT INTEGER DEFAULT 0, event TEXT,venue TEXT,startDate TEXT,endDate TEXT, TripID int, FOREIGN KEY (TripID) REFERENCES TRIP(ID));",
        [],(tx, results) => {
            // tx.executeSql(
            //     "ALTER TABLE PLAN ADD COLUMN TEST2 TEXT",
            // [],(tx, result1) => {
            //     console.log("!!!!",result1)
            // }, (error)=>{
            //     // console.log('Failed to select:', error);
            // });
        }, (error)=>{
            console.log('Failed to select:', error);
        });


        await tx.executeSql(
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

        await tx.executeSql(
            "CREATE TABLE IF NOT EXISTS "
            + "CATEGORY"
            + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT,TripID int, FOREIGN KEY (TripID) REFERENCES TRIP(ID));",
        [],(tx, results) => {
        }, (error)=>{
            console.log('Failed to select:', error);
        });

        await tx.executeSql(
                        // "DROP TABLE PLACES",

            "CREATE TABLE IF NOT EXISTS "
            + "PLACES"
            + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT,url TEXT,lat TEXT,long TEXT,latDelta TEXT,longDelta TEXT, CATID int, FOREIGN KEY (CATID) REFERENCES CATEGORY(ID));",
        [],(tx, results) => {

            tx.executeSql(
                "ALTER TABLE PLACES ADD COLUMN latDelta TEXT",
            [],(tx, result1) => {
              
            }, (error)=>{

                // console.log('Failed to select:', error);
            });

            tx.executeSql(
                "ALTER TABLE PLACES ADD COLUMN longDelta TEXT",
            [],(tx, result1) => {
            }, (error)=>{
                
                // console.log('Failed to select:', error);
            });

      
            
        }, (error)=>{
            console.log('Failed to select:', error);
        });

          //get coloumns in table

        // await tx.executeSql(
        //     "SELECT GROUP_CONCAT(NAME,',') FROM PRAGMA_TABLE_INFO('PLACES')",
        // [],(tx, results) => {
        //     console.log("@!!")
        //     const count = results.rows.length;
        //     for (let i = 0; i < count; i++) {
        //         const row = results.rows.item(i);
        //         console.log("!!!",row)
        //     }
        // }, (error)=>{
        //     console.log('Failed to select:', error);
        // });

        // await tx.executeSql(
        //     "ALTER TABLE PLACES ADD COLUMN longDelta TEXT",
        // [],(tx, result1) => {
        //     console.log("$$$$$",result1)
        // }, (error)=>{
        //     console.log('Failed to select:', error);
        // });

      


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
        return new Promise(async function(resolve, reject) {
            await db.transaction(async (tx) => {
                await tx.executeSql(query,
                    data, (tx, results) => {
                    resolve(results)
                }, (error)=>{
                    console.log('Failed to select:', error);
                })
            })
          });

        // return await db.transaction(async (tx) => {
        //     await tx.executeSql(
        //         query,
        //         data,(tx, results) => {
        //             // console.log("insert")
        //         }, (error)=>{
        //             console.log('Failed to select:', error);
        //         }
        //     )
        // })
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