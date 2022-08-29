import SQLite from 'react-native-sqlite-storage';
const db = SQLite.openDatabase({
    name: "mainDb",
    location: "default"
}, () => { }, error => { console.log(error) })

const dbConnection = {
    insert: async function (query, data) {
        return await db.transaction(async (tx) => {
            await tx.executeSql(
                query,
                data
            );
        })
    },
    select: async function (query, data) {
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