import React, { useState, useEffect } from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { List, Button, Card, Title, IconButton, Text, Portal,Dialog,TouchableRipple } from 'react-native-paper';
import { styles } from "../style/style";
import { StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

import IconFA from 'react-native-vector-icons/FontAwesome5';
import db from "../db/db_connection"
import {Notification} from "../components/Notification"

export const HomeScreen = ({ navigation }) => {
  const [trips, setTrips] = useState([]);
  const [upcomingtrips, setUpcomingtrips] = useState([]);
  const [pastrips, setpast] = useState([]);

  const isFocused = useIsFocused()
  const { colors } = useTheme();
  const [visible, setVisible] = React.useState(false);
  const [planId, setplanId] = React.useState("");

  useEffect(() => {
    // db.delete("DROP TABLE TRIP");
    async function getTrip() {
      let pastresults = await db.select("SELECT * FROM TRIP WHERE TRIP.endDate < date('now') ORDER BY startDate ASC", [])

      let currentresults = await db.select("SELECT * FROM TRIP WHERE startDate<=strftime('%Y-%m-%dT%H:%M:%fZ', 'now','start of day') and endDate>=strftime('%Y-%m-%dT%H:%M:%fZ', 'now','start of day')", [])

      let upcomingresults = await db.select("SELECT * FROM TRIP WHERE TRIP.startDate > date('now', '+1 day') ORDER BY startDate ASC ", [])

      setpast(structureArr(pastresults))
      setTrips(structureArr(currentresults))
      setUpcomingtrips(structureArr(upcomingresults))

    }
    getTrip();

  }, [isFocused])

  // const getrandomImage=()=>{
  //   return "https://picsum.photos/700/?random&t=" + new Date().getTime() +")"
  // }

  let defaultImagae="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QBWRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAAITAAMAAAABAAEAAAAAAAAAAABIAAAAAQAAAEgAAAAB/+ICQElDQ19QUk9GSUxFAAEBAAACMEFEQkUCEAAAbW50clJHQiBYWVogB9AACAALABMAMwA7YWNzcEFQUEwAAAAAbm9uZQAAAAAAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1BREJFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKY3BydAAAAPwAAAAyZGVzYwAAATAAAABrd3RwdAAAAZwAAAAUYmtwdAAAAbAAAAAUclRSQwAAAcQAAAAOZ1RSQwAAAdQAAAAOYlRSQwAAAeQAAAAOclhZWgAAAfQAAAAUZ1hZWgAAAggAAAAUYlhZWgAAAhwAAAAUdGV4dAAAAABDb3B5cmlnaHQgMjAwMCBBZG9iZSBTeXN0ZW1zIEluY29ycG9yYXRlZAAAAGRlc2MAAAAAAAAAEUFkb2JlIFJHQiAoMTk5OCkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAADzUQABAAAAARbMWFlaIAAAAAAAAAAAAAAAAAAAAABjdXJ2AAAAAAAAAAECMwAAY3VydgAAAAAAAAABAjMAAGN1cnYAAAAAAAAAAQIzAABYWVogAAAAAAAAnBgAAE+lAAAE/FhZWiAAAAAAAAA0jQAAoCwAAA+VWFlaIAAAAAAAACYxAAAQLwAAvpz/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCADHASwDASIAAhEBAxEB/8QAHQAAAgIDAQEBAAAAAAAAAAAABAUDBgECBwAICf/EAEIQAAIBAwMBBgQDBQYEBgMAAAECAwAEEQUSITEGEyJBUWEUcYGRBzKhFSNCsdEkUmLB4fAWcqLxCDNDRIKSY8LS/8QAGgEAAgMBAQAAAAAAAAAAAAAAAgMAAQQFBv/EACsRAAMAAgICAgEEAgEFAAAAAAABAgMREiEEMRNBYQUiMlFCceEUgaHR8P/aAAwDAQACEQMRAD8A6JHDx0qZIPal9/2v7H6bHvvO0mlxgjIxcKxPOOgyart9+MXYe2XdDc3N2v8AeiiwDzjPiIr3t+Vij2zzk4br0i7xRFTnFSRrKHymSTXOk/G/sa+dkOo4wCCY1Gf1pro/4q9lb+cJvubVc/8AmyBSg5xk4OQPpSH52D06QxYMq+i9291d2QIKupZt3PH6Vtb6ncJc94ZGVd2eDWsb/GWyzRSCeErvV15BB881oICxwBzRfHjpNtA/JS9MKvNYnkmcxnKMMEMOtLpkV3LgAc9BR8mlXEcQlYLtI9ajijLzJ3qOw6eEcmqxrHC/YS3VfyAgmPKtwlOr7uXgKpCY9gGdwwaxZvbW8SNLZrLL1BY8Gp87c70T49PWxQqdakjhZ2CohZj0AGaLuGSX8kCRDPRRVk7CxNFdd5LADHnAJHOaXn8j4sbvQWLFzvjsU6I0FjfI15aOEGQ2/IHT0ptqGu6XcsIxZl7fbjb+UL9KturrZTW2JItzyeS43cedU3Xba0y+y2khkBA3MvBxXIxZo8m+VS0/9m+sdYZ1LQp1EWEhVrRDFjhlI4PuKDC+lHR2Ms5JtYZJABkhRuIHqcVmysLi7n7iCIs+cEYxj5+ldObmJ1v0YnLp+gWBUD5kBK+YFWnRNZgtLL4eKMpIAMYHL1PpHZeW1kW8vxFIiAsYRzz/AL5pytppfwZjaJUBGTj8w88Z/wAq5fl+Viyft9o2+PguO/QNZ63piBXaRVZuWB8qZPrmmJIUa7QEVXO0o0s6anwkERkOPGpGV+eKrkUTyZEalsdcDNJx+Hjyzy7Qd+RUPj7Ogya/YI6AyAo54cHilzavA9wwtg5UPyR+X5k0qsuzd3NbrNLJHbqwJAcHP19KM7PaZJHcTCZ4gsLDcGyVIoXhwQm1W2gpyZaa2tDmHWe9aQRW0soi/OVH2x61HdayBiWCWLujlSG6g+tTX0qzf2WK4aHccERgFiPakWtWWn2TLAssrv1OcHHNKw48d1poO7qV0Kbza93MyPvBcncPPnrTLQ7yKymR2GWbhj5AeVByzI8YiiiVEU5B8z86ixXVcK440YVXGtoe67rK3cPw1uGVCfGc9fb5UmWtVUmpEQ1WPFOKeMl3bt7Z4V6pFjNSJDnAHJNW6SBUtkArZEJPpTG5tbeGONUkLykZfH5R7CoVQUpZVS2hnBp9jjTE0qJlePe0iDO9getNop0eISE7QemeKrVrFI5YoQqqPEx8hW7k7wssrFR6Vz8mFVX8jVGTivQ7l1GFZO7iDTP6IM0Bd3U/e4ll7oDqqclf9ajW+WG3MVvFtJ6uTk0CxJzkk5q8WDXtFVkZtcy7vCrNt8yTnNDZHmufrUm2tdla5SlaEttn5ox2Tbc+BfWmFnp1rJdKt1dGKLGWfbk/as2jEgKwzjI2lfM0TDAVIYAHzHp8qpJNaQzeg/TdL0o3OZNRDW6AbgE5bJOMA+20n5n0pzddmtIuryKLSdRG+RCSQcbTzz7cYpWtv3WmGRowGkICgEZzkc/LGfvRenWTxxlzHIFUZ3Z5wff0pVYt97CVJfR0D8Kl7XdlJ5ZbXWd9uCjS2MsmUuIyCW25/K3HGOcnzr6OhutKnNvfaVmS2ZAwYg5J8wQeh8iK+R4bnVHmVo5DcLGuF3ZyBnIz7eddh/C7tgqXq2Oq3AjS9fbErN0ccAg+/Q++Kb4+a8d8cj6YrNjVTuF2jr2s6il3GscUJiA5PuaW728uCMYI6iipIeTxUJjPpXaxTEzpHNq6p7ZozNOxaeRmPqa1QEdKk2H0rdYvWj2l0V2zWBtoPAP0otbyZD+6Z1XOcBqiWMVuqegpVKX7DmmvQ2syJ7F5LqZu+B3RlW5VfMfWtLWzlvpcNKRGx4jyQPtQatKfM9MfSmegGc3gjRc+fPlWHJLxzVSzTFq2pZcNH0+30+zWG3QLnlj5sfU0SsEKuXWJAxOSQuCTSSHtf2XVxA/aTRzJg4AvE8uvnTfT76y1C3+IsLuC6h3Fd8MgdcjqMivP3ybbZ1JSS0jS9Z7a1leKBpht4RaoE0l1I4gBkjR3yA2QTn1rpLEKpJ6DrSW6srPULsXCd4GH8S8BvnWnxM8497QrNjd+mRW+mQ2enRxLbR3ExG8hgCS3rU1u9nZB5LmNIZWxtBQKTj0xTaKFEO4KM4x8hSjtNHYzw4nuRHLHyoAyefagi/krVfYVLhO0LtQ1W7vFaOBFSFiPG5HGKUXF1K6CNZGVR1APU+taMvUA+GsqhrsY8MQujn3lqg7TNSayB7qFXYj8zdSfnUbuZbgy3IQsDnAHX2qBUqRU4qcJTbXsiumtHpXMrfkRFHRVHStVQYqVU9q3VRU5aWkVpv2RKhqRExU0URdwqjk8U3XRf3XE4MmBxjgUnJnmP5MbGJ16EypUgFGG3W2uQjATH0HQmomXLHahHsaBZFRfHRNZWIl2vJKqJ1IPXFTNHY2wIJM7k8Y4AoQbzyWOfnWzbmbc7En1JpTmm+30GqSXSJFu2jV1gRY1fr5mhjkmpQorIWiSU+iu2RBSfKs92amVa2CH0qcicQbuzXtlFd2fSsd1U5k4nw3D2dsra3he+LCVLUnbAuS7FgMgn0UE/OsW2i2y3koulSa3W4dGKvsyAoI59+cGiI9Z0y6gxJMirwQG/g9QPr/KjpbOMKvdz85Xr1UgE+fnjOB71xZ8nJ/k9M1cER3i2T2Mdta6WytDcJM4ZlaUKNy8EdR4h6+/SrRp1voEOmzx3jlZQBGpKDJ2+McfoB5j3NVO1upbPUEX4gEbQNzJjax4IyB05z8zXrzVfjryJ2jw8OUlEbdMDIOftT/nuuiKUh5q+g6NbC71MTSNpUkTSR7RjYy4wPcnevHlzzxRJ7HzXjwpDDOyxuVOHzww8mHn06dKUadqcdjCjCWGW1u4djRynvANxwwI6HjisWfbHWtOuvgFmMPw8JSMsCdyg+EAk84wP9ajzW1v7RaU/Z9DfhtNPqXZwR6xKIryyKwSEJkyDHhcjPBI6+4NObyCKObbC5kTHUjFcd/B78SBpnaO4God2ljfALcySuSqkcBh6DPUeQrudyILoI9nb8bdxMZ3Bgeh48veut4Pl1kX7vo5/kYZh/tNNNj051CSxRjxeJnJ6fSh9TtrJZz8FKzJ/dcc/SsNCVOCMH34pT2p1yw7O2CXd/3jd7IIoY4wC8jHyGSBjjrW6VquSpiHe1x0HxJsbOAfmKoH4vdrYLDTzoenS7L9zm4kikwY0/uH/EfbHHzoDtJ+KksdvcWFnolzZ3bx7VmluEbu93RgFzz5jJ4rmluUnuGN5IJSQznLEl29z86JtsuJ17CbK/1aG6N/DdXULBztk7wggEeufOrBB277Vppb6bHq0kFu8PcOQoLlcn+M85wcZ9KrBC+IgdTwTzUkkbIgAIPOeg60DSa0xq67I2iTveo7sjb/AL+ldC/BvtrpnZPUppb5p1jmjEZA/wDLwMckDz464Pn0rnpXxsX4Gc1E4DNgKMqcgGgyYlkniw5yOXtH1/2Z/ETsj2hHd2GsQJOf/QnPdyfQN1+maei6jEbNZp3rZC+gr4n7obTubcf4cDz/ANirv2O/FLtJ2fVLee5/aVhGp2w3H5h6bX/MOeOcisVfp6X8XscvI/s+k9U1OeMd0Y1Geu1qQzZklZyD4jVQ7O/inoGuygXySaVcMQP3viiJJwPGOn1A+dXmOIOMphh6ryKZihYlrXYjJVW/wCd2PIEcVlYqOSILncDnyGKb2tnY/DK8wDORk5NTJ5ChEjFyK6sdbqlEz/DLem3jlXcQWSMsN5UdTjrjmsiP2ovk2tlKSNbWQxLKQFRjgEnGa8YWXnadp6HHWpiGIAYkgdKIs5e5m3t4j79R8qU7pLYxSmQQ2dy4ykLkfKsxtICQWbIGAOtHzXk0zNFbBjk8EDnFFWNnHEiyyJiUDPXOKRWZpfvQ2cab/aCWUU6KCLZnkboz8AVi4sbrBdyrAf4ugpkt1D/E20+9Q3U/fI0cJOPM+vypCyVy3oZxnWticA1sqE8AE0U9q8cYdwBk9POiLHul4KlmPtwBT6yrW0KUd6YIltIeNvPzrJhKMVYYI8qMleDOY4zuHHoKgOTyaBZKfsJykRha2CECpApx0rZUY8VHREiLbWNo9Kn7usbFqlRNHwXddjrOSKK6s7hVjlmLhFOeGUbVz8/vmoLjs7rVpaiJO8lm3qW/eeEqQcFffn/eKPtdTmuYt0DLCHX92q8dOfqMD+dT6rrN/ADEkZmZ1Kd2/AAKhh/3rzmPysyri+zY4QmTUr2Nvh7uxWRU2F26EnOevqePtWgvLOFZ5B3iLJh2DZ8sj/vTKx7WadeabFqN7bhRNIYMbQ7byMgY9cjH2pnqmm6Tq9jDCCLd2faASEIBzkY9j5VsXl6ernQHHfoq8M1qbMxIAyhmwp/MuRnBHscfep7O7V7V5Lwd73e0qHGDznIA+9F3/Zi2W2FzA01rNPOFQuSdh5G3PqcUmvtD1wJE7ypIVYgYPmucgj5c5961Y8mPJ6YvVL6Hdi2n3sA+GmG5VOcDg44IPqP6VY+yfabVtA1G3kW5uTFCRgBiHABJwpz0zztPFcwtrbU9OjEFxA0ZXcxI8Jx1DD15P8qaJe38Losjuyt5Feh9c+X+tGsdQ9wyt79na7z8We0qXb3kOtSTxuMLDLABsPn54PPtz7VUO1OtzazOmoayzXN/JEDk8dScDb/CMY4AFVrT7uJ1PeK0ZcjBblW/3jzpoLIODJbkyk4OPP6etdXxfLxv9trTM+SK9rsHtwCQoAUDyHAFHRxYbMbgjGMgYxWLeyYEIw6nLcdaPSBV5A+5zXS2jMYjJ2bMIM8ZC5Ne7vJJbJ53YNTwQgcYwzdTU9tESQzRlh6DgGqIBi0cr3hGA3T3rBgjjUDB3eeR9qZtHJliqAE+38qhlhY+LA+tUT0LlRvGSc89PLNYMWUJH14pikY53DArYwRY4JxjrirKFtqe6ywUMV4GRwKNg1vWoYjHbaneRoWJ2RTsq5+QNY7hVO5SMH2yKxb2Mlw3dxLubOQAev3qml7ZabLD2S7SdqUU2Ntrl6kbNyhfcfU4JyR9KMGp9o55HPx+pMWG1i07qMHyJJwKT6MiaXqNvczO8UsMqth1I8+fmKaXN7b6jeSqA82ZD3Ss7E4yemTzx/KgSSp9dBe0ehkls7jv11Ii8Rt2+FizA+m6uo9gu2YubeOz16ZYpGBNvdykKswz+U+QYZ6+fzrkk48Z2qqr1wowBXkupI4e6Vx3e7dtJyAfUVMmJWiS9H0usYdN6kMp6FTkfevdx7VwLs7rmqWJE2n6hLAsbcDJK8+q9CPpXZOxvayy1m1jhvJIrbUOhQ+FZPdcn9PtXPyxWP8AI6NUP7UdzJu8WPPBotrxiCBGpB9a17g+lZEJ9Ky05p7Y6dpaQKEy2cedFRSFDiOJBxjpzWwi9hWwjxVVSZF0aTO0qhWAGKjEdEhBWQntQqtdIm9gwT2rOz2ojbWQtVyIQop9K2CmpgtZC8VXIiTZFsr3dj2qYCs4quRfE/MibUbtUtoYWltLi3YrIqyFjzgAg+XX9aumtyXP7PY2jMZxDkuTuY4AbYc+3FVTtLpsVteW+qw3iFCsAlCgHKFn5wfZVHPWrdcvYrc3McdxJuSZrdScj8/iB9sdP0rhZblqalGxLWxHYMnxzaXEq/DJHFKpIIIbaWDD0IyOaWdvZcPY6lG3jikMchDdCApz/nT+9tbWDWZri01QXRuF7uGOGNm2qoClmOeCemBzz51H+IvZzSouwun3lm/wkjTgXGdzd9I6kHOc4I25+tMx5ZnLDf2Lr0wXs120H7La0m/eTN4ssM4IHXnz/WrRp+v2N1JC6NGFhtxuctglnO0jHyAzXFAYrS4CHvhjC5OM8cfM1i21C4t7h1SdgDlg+fzcYzW2vFmt8XoFZDvc11p7TCMIssbgMytycMxGVOf8NbR2NlIFkkQHlcoR5dPvyOK5BZdqJlFtECpJVVQ4yRtLYX7kn6Uzg7T3cEMLySF4wEfIb8p6denGM/XrSlizR6YXKWdFttPmsEESOs0EvTcgBTqDzRpha1CkxeBs7huwFAAIJ/WqRomuxvuEk0u5dxXDcfl6fcH71v8A8XKHuogHnVZXhGWJAGSAfPjrRTkt75ImkX2G5jKnvlYLjIBYk/Q+nzo0Rwd00kUjTYI4AxtGM8+lUzQ9YW8sXk2ozIFbAbGQT5fSttO7RoWjEZy4yXbooJIIU/fFa/G/UbxdfS+mJyYFXZZmvI2cxxRNIw8oz5e5qaFbuQ92JY4F/uxjJ+9CwX9lNcTQoqq0eNzR4AJ9MeZqc3ts+PhJ4ph/f3e/pXaw/qGDKunp/kx1huQm7t7mwdYJomYsRsycE5/nn1rzvK8ayNGqxtnHiycit7+Vp7WB5GIkjKjxHBJz0oMShcyHPLDCjyPU1oi3Quuug15NgjLKMMMgZyDUhKqik7V3HoBkj6VHK0S2yP8Awv4stjjnB/rUk8KSok8RaTA8aqeR7gUKy/2XohjzNOIQo8Q4BHOfSjOz9sV1ZUwM8g+w6VBp80cWorIVYgHHC+fWjm22198VaHcqOpGRjaepBFF8je5/siS1sg1iKT49+/mLsDhgc5GOMHPTpS6ATQzkoXVlbAwcdfMfrVy7TWU+oyPq8NrtWZe8CxnO1DjAI65HIz54qsPE4fYykNV4rVSXc6ZLpEcUkm2cSEHJ8LHd04HtzRmraa9pDay4fbMp5IA8Q8uPmKYdmbIQX8sM7JuUlXU4I44I9zz+lPbu2j1TTp7NZVjKyJJFkEhT0+2D/OhrKpvr0FMbkpFlf3NkSYhHID1DgnNNNO7RIy9zcad3pP8AdbBx7UtubUwTyQTeGWNirg+RFax7Y2JXcGHIf0+VNrFNdi5tydR0X8VL20VY723+OjA43/upseXP5W/Q1a9K/FXspdssdzJc6e569/FlQf8AmXNcNuc7I5XxtlXIU9AQSD8uaGEoXJPjB8iOayvw8dB/NSZ9XaffWGoQCaxu4LqM8hopAw/SiNo9a+Tba5mjn7y3neKTyZSUP3FPNP7cdpdNK93rV6VHRXl7xf8AqBrO/wBOr/Ghi8iftH0ttrOyuJ6R+NV3CAmqaZFdAdXhPdt9jkfyqw2n409m3OJ7DUofkiN/Jqz14mef8Rs5cT+zpYXFZAxXPLj8XOzrLiwEkr//AJv3QH86S6j+Jt1cSYtb2xtFHkjBifq39KmPws1/Wv8AZbzY5OvAVnFcgt/xOvYAO+vdOmA6l8A/9JFSS/jZpFjG7X8cMrD8qWshZvrnj9aKvAzr0tknyMZ1uqZ2v7faF2f1c6de6hPFMIw7LHaNKBnPmPPjpXFO1v8A4gNeuu9j0aC20yEghWx3kv3PAP0r5g/Ebtxq2o9q7medpbuQBVaVpZMsfowHnVV4jxTyykWbm9QWfUdOs7jTtXBDlJmj3MV4jKx7gQfLJH6dB5xaNp66pBLaPcw2myW3vAefGqbS446cdD7Cs63GU0PU0UmNnEDybOCBsxkD79TnFQdhZnu+01par4FuLAnLDGQ0fXA9wPP1rykulidJ+v8A0jb1sc9jtNXTu017JPJMwsxuR5oyodjnDk4wR1PBIzj2qPt5eabr+j2mmWF3aRRWbhiLiR0Mvh8JAx6ljyfPyq/6Z8THZRiGRm2R+JUjjYjy8x0oHWRqM+4bXaTOEEtgjZAHT5efl0rCvOdZeTXr8/8AAi3paONvo88W9Pi9KKkDrOxIHXgkcUnudOKFz8VbqQCnEhYe4+VXLtTp2rRXCO9jZvnP5rHYOTnn/SqtqMl2y7X0y0iGduUh2g4/SvQeNm5pPZn2JYLdQI7cTRtIJfCynjccDHrjFbLc3MNvLYTRFY1lDBmB8mOMeucmtb/4qWVJNsSSR4IKKF6eZxRugXEw1OySS1iu/wC0BhE/IdmwMH2rdvrYaohutTlTTgYXK96rgqP4Rnb19wKh+MuIfhJY0ePfC2T5OMnP2q6/jNp+g295ZT6PFb28U8TRsIIiFV422seTjqOg+fU0D2p0O1k7HW1xo9zFOLSWWTaCSwhk2YHzD5H1zSZzQ5ltewwODXxaNbxxtvSGFc4bBPgbGT7EiprfW4v7VLsPdu6OVz+Vtw5GPcE0NH2bgkupLOF1E8tsrIXPEbiVFOT8i2flQ2rWI0+8Sz2sjOlu0gz0PO76ZBP1qax09L2EtlvuNVayhFz4lnm77Zj+HBOOfUEfrWdI1dmDfDkulvCSTjrlBk/P+tAdpVEkbFFD91IzBh5hw6/zXp70g7HXc3wWsOMlRYMeTxnK5+uKSsaqGwt6Z0k9oJpYIHjAlKO04kkOCRkkfIDj7UTb9p3nlF00iBBMqd3gDOQft0/WqBol5/YreJwHPd7CG44Lr5/em3cwv8PBEygyETOrcbjtTj/q/SpyqOtsFpP2jocPauCK7FlcQsF7vdINu5Q208D24/WnFnr9gIoZYWRGmlZOT+Tbjk/cfeuU3cszandMH7wflwp4GFwOfnzQdtfyNbTTKwQNJtAzxuLYJ/StE+Vma9gfFB3GVrXUJJjbTolzGqyN4htcZIHyNS6XeRyruC5cgbwB1B5z71x6y1G5bTZNkjL8RiM+ROGHPy5+9HHX51nDxyyRqjPEmG5AVdv+f3ps+ff8aXQt4J9pnZ9Nvf2dJ8RbyH4eTnIOdh9D/vHkab22pWlyptNQgjwBlHxgj0IPlXCoe2d6l9JL3nLo2EbpnnkD34ppp/buWQISchYREFJz4ssSefPpTX5ktbaZFjqfs7Y9rp8csk8cZiaQeLYeM5znH6H51Ja3NkbxpIpWAB8aKMNt9vka5dpfb6BreH4lH7hgC0i/nQlsD6U/ttb0+aUqs671OEkUY5zgj9Kfj8hWvYNS19DrW7AXdy13bTmRpD0YYYgAY+vUY9MUnMTbwCOc4+tGXGrRwDe6r4+MqfC3XnFYivbaUM7R7uOfXHr710MWdqdP0Z6nb2Qw201wgCgY8gT5VFPbPauI5UaN+uGFGRyWsUR/eMqsCVxyD8j/AJVDqWp2dzYCGSbLx427lIP0ps5e/wAAcUDA5HCDNBzsOjlSRx8q1km7tRIWyrflKmhri4UgsytgdST505X9oDRrMyj8rZNQFnPkaHmvQDlcACll3qbvkBz8hV8mRDSWdYgS8gX2zQM+sQpkJvY+1Jbi4LA5Y/KgpJ1CkZz6VOy0hlea1M2QCEHzyaWS3c0uSNze+eKEkuWwVVhg9eKH5diSc1EEkFSM/VnU+Rw3Suda7cQyavcvDZGYF/E0r4IPpx5V0KCEHr965nqsYvdUu7hY1kVpmAPeqOAccc1zf1P+CTNPjLtnYr2Ga67EXupzlI5GsYzkKQFkVsDkjzxjp1PvVd/D2eN/xEud28sIFByvmFHT0GT0+VX/AFLQ7GH8PnsIe0drbwvBzdquFHIwR4s84A+tVjsd2X0zT9fuLqz7YaVM4jBWBIZRuOPzDAbAPp0+deDxZIeHIv73rp/j8HQbW0dF0w3M8bJA8UPcbQzucBwwzx51tfWd08TpNad6rDBMbKT7nGQeaE7K2i99rEn7Ts52+MBwol8GFAwdy9flxwelMmlnWMDdFdbm2mNV8cPn4s+E9PI+Y964WWbnI+AFJMrt/p9iYFWCaSIk7AVdvCc9CA3Uev61Wrzs3Jdxtu1a56nKn94mc9MFziuhrpkd93IuNM1BN6s7P3qgRnrggHn06eVVfXewGjtbJObuWKRRjdI688nrj16jBHQ1s8TyeL4umn/rYioKBfdk7yHdl9ydd4tWwRnHGM+dImtP2NqCXLzoskLb+7EbKwIGQRkY+Wa6xb/hdot1bvObq+sHRhgzOmD4cnBHv7/ekV/+GWmpJIf+KNMl2SqoSaRg+CcYO3Iz/Tyrt+P+oRT4ut/9gFOu9nMtT12TUezdrayuS9rcSSgDlTvAz8iCD881roWqFNE1a1lYlGtsIMjht4b/APWuh6h+EmmNK5h7Y9mYAYyxQzyBg2cc8mlL/hUqWUrR9s+zaBw2VluGB4Yjrt/yrfPl+PU63/4Yzkv7E/Zm9l/a9jeMXYTOQcrgMQwPXzojtvJFba2wBDA2REYI6FZzinGidhJoINJuW7Q6BMFuiojW5OQAep8POcYHAOcc0w/EP8Pbi/EWqjtP2egY+EQzXRQ4ZyeuD0wB880LzY1lXf4DTWvZWLrUGm7IW90qp30rSRuMeQIcH5c/rTK5jgFi9tbwmBruyUsgHKn8jcdP4c1vB2Jux2VED692dkSG5mjP9vwsmY1Csrbeg8xjzFWtOw8osbVJ9W0a4ZraK2Rlux3ke5nO7pyB+uKXkz45+/tlqk/s59DHLaRzRPwY9GllXHUuk5Gf+indugWDSbrBBuoUwccLjCt/JfpT9+xd42pRxvrXZ2Tdo95AzJfhh4pJCGPH5QW5Plit7XszcWq2Gk3N/pF3Fb6fM6yQXykh9mVbpwoI6+maF+RFff8A92Tr+ysaesj6obYIcSRK+QvR9i8foeKiv4j38tvCVjMdyJGwOON5BP1FXmy7KXved0NT0dZPjrKUSm7CnAjAdcY6nnA8wc0uuOxt6moytJqnZ+Qz+Bu7v1z4mbnGPLI+eDUjyY37JtFP0e6EwsU35DsxYk9cyDnH1rF1LFKkoBCyRTynAzhiWwT9xTK17F6hb2unPHquhFoHKMfjwveDvOq5HPzqLVexuo2+pXEI1LSWTvZsbbxf727z8+nHsa1zeN10wNrQNBHJNbRXgcESq2Dj8pyRg/fNS2SrBD37P4VjZmHXx59fLrR2mdn9ThimsVvNL7vjGL5SMhuT7f50bddjb2G31CzS/wBMOJAEka9RcKw8x6+oqnklbTZaaF2nSr+zJIS21RAdzjkKwZWHyHGKbWd472AxnvGL+fIO7B/lmlFr2U1QXMtumoaOpaFAWF8hXhefp1qy23ZW7ghndrvT22s2zZcA4JPn7cVV3jXey0zWe+v54I54ZZXijA2Lj0ByfsDzTbTO000F2Z55BINpztwMEkNgD7UZp/Za5UGMX+nJkHBa5XABJPQdD/WkGt6HcJc99He6WgcDMfxGSMYHGB7Z+tTB5XKtJlXK0XG31MahB8RHhUJI2jyI61FNNtzkn79arGhadfRWwC31j+dxxOemRjy60fONQEjI0kbYPVckH9K7/h+X8m5f0YM2NS9ph0t+2zYWO0eRPFA3F+WAAPHlnoKDliuzksob70PLFd9BGv3NdBZJFaCJr1zF3e8Ac5wOvzpfLOqggGtZLe8P8AGfeoZLC6K5whPpu/0ollkvRDNPnoaEd9x86L/Ztw390Y8yf9K8dLul6KrfI0auS/QEBnzoiBF4rIsL7JxDn2B5om20vUZOlrJ9qH5EXo3SItEVjkEbMMBiM4riutO51S4SVg7RyFMnHkfauwa7epodnIbtVWdV8MLOA5J6ceXr9K4rN3skrybSdxLE/OuX+oZZvUr6NPjTrbPpHUoIf+A5rSQhtqRE7+eSQcfoKS9hdJ2dp71mQMVzksck/OnmuO7WM23G6SfKgjjwjA/Ws9mVSLVr2UqQpTOB65xwT868lENYq/P/AALeV8kWXSIIbU3TyQ3CtPP3ikHP8IGfl7UdNcgIUjg2AYzufp9hWkLyLGdkb4wBkqT9qCvpJdrboDITkY7rArlvxpyW2yqzNEd/HDsUyTsQDk4J+wAquT6bokm1pp5QVGABIRjn0Aoi8vJzOAlsAMA/kWgJ5pxhZVRfkAD+ldLxvB4rp6Ml539EL6fozHwm5Yf4pm5+mKAm0uDeTYyzRkAsqKzDGB60Y9zGjbXYgnyzzRekT2rX0KnxKzYYdcjoa6keOoW9mb5KbK1NpM724uJ5pn3kqu5jyB/lWtvoAktbh/F4VHPXzq5doms7WS1sWdC0SYJHXLHP9KxdXOm6fp2xpNxmIHhxztbxU5X+1a+y+VpsRaPo0cdxYhVdWRsnHnzxW/a3RkutTMmCNkW44Pq5p3aajp1vel2cKECnORgZY8fpUF1qlk2oBMk7xGnOPY0tJvJyC+W+OhT+xki0K2I3Kf3gDZ5AIUH6cGnPwJhRIoiyI1siMxPi5ZvtndUt/qVmlqYy3CDC9PQk/wCVQDW7e7sbtncqVUdG8sgCqeN2t/ktZaTBpLSPM0sakhNJdBz/AH5H/wD6o+2tVtrSwji3CQ2zRs/OdrDBH2oSK/tDHjvGw8Sx5DDoG/0qc39sJUVriQLtX+P2AoaxfQc5LJrSGHv/AIfYwXvorgn/AJEAA/lQr2USXE5XwghlUgHrhzmo/wBo2aSyn4iXOT0fyGPagn1G2mhV3llyJQSO9x6j0qRh7C50b6dpUP8AYI3BxGOBz131rJpMTGWdtwO58nB5y1ehvbdYIHEsuV45lPHiz6e9DzXiPhczZV3yBKcfmpy3yKStjOzsLVLJS3/myAHz4Ab/AErzWkb2NwpYsZcuTzz70ja5DFgIZtoU5/et05qS1aXbk2zk7ccyMfD5fyqcPbGTNDC30y2KSsepjGAB5AAUxtUgWAtuOJC2eP8AFgUpsLW8mt1t47Ny8iKOWbgbgT/KrDBoExjdJUCRAnBGSSCTjHPt+tX8dX6GyuPtmY7u3hg3SFtxB4+eT/ShLhY7q4ZxGWYgYA+QH+VM7vs2z908cSqwwGyTzgdfvTHTtJFvMZo40D4x7DnOabj8Jp7I6FulWkENtiWJg+4nB98UXNNBg4i/WmElqkqHxICOpJ5PzoK50tkgaYypjjGFrrePix41r7E3yoXTXEflbk//ACoKa7C5/sox/wA1MpY1aJUjUFl/M2MUHcWxKY7vBHINa5Ui9IVzXoxn4RfbxGg5b8D/ANqn/wBqNuIn2GNkHGcZFK54HGeM0xSgkpNW1RR1tV+jVr+2IR/7Vv8A7D+lDSwtg8H7UK8DYOAaLotTI2j1i0z44JvfaU/pRcOraYVP7u9VvLiMiquUYHpW8W8HzodSFxRz7tZNqE+vXElyvLSemOKDt3McZUJnk10u/wBKt9Qhk72BTKVwr45BxxXN2iuIHaIR52sQcg9c1wvI8asVf2mbseVUtHf7pQbGJTbszd5vHi8y3T9Kl0+ZLeOSdrZ/3pIX18POfvii4bcTTwIH/dR735PuaMigjRY1lGcAqR8/9iuDrS0zGq+wLR55rq2nSZZs7slu8wcE4yKE1oy2V0sT25uGdd29pm55PFNLdlzvjHdqxCsPKsdpZo3u4hGA+1fz/OjmE8noXVftKyzs2WOlx9even+lREOQT8Apx6MacRxk5JqaGDcDkdcVthKTM6Yhjgl3rI1nEePPJ9a2gj1KIpJFaxxsD4Co6etWhLTBJKcYwBRAtg2BjCjkZo+aK2ymajHq883fyQxtIcEsR51pdW2qzmJDBEAkYA48ySSfua6BDZK8eGAwf61ELFxFkgcjkmpORaJuiiPpWssZEAQgkE8en/et49I1p5ld9hbvVJ4/36V0JLYiNpOC3lx5Vta2jhgGAK5zkedT5Gy02igahoesTopEi4KEtx5k1radltRW1uYTKC8gA+x/7V0qO2Xa6uOvAx0qSK2VTkjJ/wBc0UzbWki/kZzqLspeogHejOwAeHzyalTslev3e+Zdyyc+Hy4rpEsaK0SgAFelYVULZAwaJYqL+ZooI7D3T3Uzd4FDDOdtEW/YHPdq9wx3Eljt/wAXH6VfWKsF5qQzJGdqMAfM5o1iL+ail/8AA9tFBPA07s7bNhAHGOtG2/Ym2eXfLI+cngH5c/pVltijz8uODnJqaOVJLgW8DhmdwoOepNGsc7IstMSW/Y3T3lYxhycYds/m5P8AU0ys+xtm0jTSqVQKqYz5DpTS71OCx3QRKsTr4WPnkcE/Xmlza5udS8hZVIO3PHBolj5L0F8nF9jIaDYwp3SKF29MnJGTXodAtRPtZtz5IGTwuPOodL1C2mmkIJ8RJAznFGnUrW0iluJ24DBemc0aWukMVt9gd1aWduxXHeSZIPPX/T+lAfBxEnwryc4oe61uGWZ5ehY5wOgFCvrPUjbgedaYlyhLyNjOCzt402tGMeeK9fwR3KrHtVI16KKV3GsjaiqcNt8XzoQ6y44UgmiW/ZfKl0NRpttnLLQ82n2xJIOBS5tbfOC4+lCT6nLJ4UJ+VMTplbYxmsLQdSDj3oWWx01vzxpn51jStE7T62+3S9JvbsZwWSM7R8z0FWC1/CH8RLobv2OIQTj97cItC7mfdBTjyV6RVpNL0g5IVPrQz2GmRgnuoz8quWqfhB2106Hvrm1SRMc9xIJCPmBzVavOzF3aTd1dyPC+M7ZIypx64NFP71ua2R47XTE0raPHlTDHn/lqD4zSEz+6UfJRTd+yrXAIScu3tGT/ACoR/wAN+0N2zLpVpPeyKNxjSMhsfWi+PXtkUMDk1jTYELIgIHoK5tqvaC1fUJ3W2VQzk44qxazpWpaZcPb39rPazISGSVCjD6Guaavti1O4R1KnfkAHyNY/LnUo0YcW2z6FsXKXbKB4cEVPNNtlUZ8G7r5egFVuLUpc4UnJBJx71BPcyvw0pC53YJ9OK88p2+ycGl0Wm1IWPYzDxe/lQ0rpLcFVYELgDFIk1KFZBIZsscLgHyFRT6/DHM4QeWdwHXFMia30hVQXGG1iCrlwN3XmjIIrVcqWUBTwfbyrnk3aKWSTMIPKgHPlz0oW47QXxZm70gnFNnDdeweCXo6kXtVckyryfvXnvrFFJLg4FcsXU7tjnc7c+VbC8uGJLFhmjWBL2ycaOoftGBTuDKFPStH1SI+Yxj9a51HesMHxOT96w2qTsBtyuPfmnYvGdevQLlo6KNXgA8R6ehrD67Dt2qAvqM9a52l7MT54Irf4mY+ua3Y/FiRblsvB10ITtdR/KtR2meJgxj6eY5FUoSzMp6nNSxPOfDn6Hzp3xSCsei2TdpJ5ZO83DJ9ahk7Q3JIGVGBgYqtB5cdRj1rVnfOCRmrWKS/jLK2uXLOMN0HTNYfWpzg5IOKriPkHfIa2Mi4PjOKJY5JwH0GuXEUjOScAY69aJ0PW5PjN5P5RnOelVVpQcjxEVvaXptnLqgJIxzVvHOmFM6Y+vNbkluXcsxZjkk0ENXldjyM5+wqC0j/ad6ib8SStyET78VvbWjwhpNgkABXpxzVypXQXx77GukancZcrNs8BPJxkjyz9aK17XDPFbwRuvdqDI23nLHPX6YquMgV2UJt56ehrVlZj5k1fCd7YS6Wgz4qZ87Fdv+UGiLCLUZXDrbM6+hqDT5WhjZFOGY4yo/T610jsl2Pkntlu9YuJII2wRbJwzD3Pl+tU+TepQUxK7ZU9P0XWNWkxY2klwejGMeHPu1WTTvwt7STEfFXtjZxkAnxF2HtgD/OumQ3MMEQigjjjjUYCoMAVuL0+tOnFr2V0xfo34T9mYdPFxefF30gOJJDKFQf/ABFO7Lsx2T04q1ro1mWHRnjDEfU0ML49Mmsi6z51Sx6fbD5L6RaLXUzbJtt2ES+QTgUZHr90P/WJ+YFU1bg1usx9aCsEV7Qc5aXplwbWDJyQN3mwPWhr34DUF239nb3I8u9jDfrVdSdh/FUyXRH8QoVglei/lb9lgsLHS7SMPa6bZxAHAKRKCKa294kXRFUnzWqdHegcbqJgu8qWB6deaXXj79hrJ/RYNa0vQO0NuYNb0izvkIx+9jBYD2PUfSvhf/xD/hfa6J+KF9a6BaXUdhJGkyJLNGdpbOQpZgSvHUj19K+0or/H8XNcv/FGDtnd9phPoWl9nL+zNunj1GMNIjZbKgk/l8/mTSv+maX4DWU+dFE5yVUjOQ2B5c1q9nPIzKzEL6elP40AztUHjrXmjL7uBiuNNJekLdMrp05UUksWIxXm01MDK8nirEtlmPkjHmfWtIYMENtJIJxxxTOYvYiOmoWwvPOakFhbYUMQQBgirA2mSsEVAN8oJwOoA61ldCuEg7x4yqAZyBnNXz6ItiaG2jYiGCJmdjgBRyT7Vcex34ca/rltNd2+jXUscahhldqtyeMnr8hVh7K9nLHTNPhvtQkiM8w3Jt5aNTx9z1oiadRK3dSPsB8JyQcVu8fxec8myOuPsqt9+HHaO0hN1Pp8Vq8fJjMy7uOeBnP0qnXcUSykKCGDEEMpHnx1rqokJOep9aXX2lwXd4bvvpYpWUKxXBDAeoNbfhaXTFOk/RzmNSP4AfnUixyN0XHOKsWr6CdPjWaKTv42bDZTG30oOKFe7IOFfd+mKS6cvTBFnw0o8jz6VgW8pHWmyxkEE9K1aI9ar5ShcIGIznHrWWtV/vZ4owxgj0IqIR4NT5WWDCBNnJrBjjHvRfdgr/lij9M0DUdS3C0tXcLjkjaOfc1ayMiQkSIbDsUn1wK028DEeQK6Ho3ZGKBo5b+Us68tEo4+RPnVgj0nSAoUaba4AxzGKfMXXZDl2hyNbzmZFAkCMqkjIGRRLyvcS7rmFWOfzINpH24rqsFpYpb92lrbLH0KLGBxVqtfw40a80o3dqltulUFg8hC/c9KG9Yu2/YyJq+kcBktQwykrMD03jBq09meyx1O0jkud1rbxjgqMtM2eSc+WMAfWrLDoOlWt60qQ7ipK7S25Pc89aaJIqIERVVQMAAYAFOiHvdC96IdM0LRNPKtBYRGRejuN5Hvz0psbj/EaXmYetbQK88qxx8sxwB607kpXRO2MYS877Ixub0raQTRZ7yN1wcHI86EtLgadds13ad8BlMb9uCD1BFX2ykj1Hs401jGqT7egUF1P19qzZvIeNrrpj8WJWn32UtJx60RHIQfED71pDouoXH72OM4Jzz6+9HJc6hpFyBqcSuojAQOAQwHQZ+XFE8yfU9spY3/AJdEAlx14rYT486J7TavpmoabbTWUUVtIp2PAPzD3z5ilNhBeXYJt4HlUY3FecZq4vc8q6KqdVpdh3xAA6/rWvxfvQVzaX8EbzSW0vcqcd5tO2hknzTZaa2itNexzHdCp0uQB1NJUnAFZ+IB86vRB4t2f71CX1va3kolnUMwXaCT5c/1peLjr4qx8R71NF+jgwlXI2Jgbs9aKgMcihWJB8/TzpXG+OlERPg54ryylF9jGDut7bjuTd5HyFEyyWsDM8UeXBG3J86VqepBwM1t4myQMnz9KiSB2wxLlBNvBbvdm0kdepNF2F3c3snw6yEoDl8/3elLLeOR2znOD5deae2aR2sOxVAJ5bFPwY1kr8FO3KLC1/aGIq9phtmAVPGfKl9u0bS7ZH2g9D70EZvesd56V1U9egOTfstnf6Nb2jpcYmY42GI5YfPmkUk0Zkbu02JngZyaBEnFbBxVS+JdXyDQizQskgVkbghvOq3q1gtneMsZDRkbkIyePTmnauK3DBuMBvbFDkXMErSo8g2qm48AADzra5s54EV54JIlbIVmXAbHpViHdpwsaLznhfP1pvZ28ep2HwOoRPJCH3oVfaykeh+/3rNccVvYUTyejnBCtnHB6VbOw/YK77URvPFP3MCna0u3IVuOPc+1WfTvw+0OcsXe8AJ4He/l/T+ddF0BINE06LTrG2jhto/IdWPqT1JPrWWsr+jZh8bvdeigwfhvo+nMvxNzPJOON0mNuQeoA6fU07NvPa913MYvl2FGZAQR7n3px2rQ6g4FpP3GEyQV6mkOjai1vOIjMhcHkK2WB86ZGWuIx45l6Qj1C3uIrhswugzzuoVZucE811GW2sdY07vZEjlJ6t0YfWue9ptJstOkYwagjktxEeoFbMHl8+n7M+XA57XoGSdkY4OCOKkS8lEZiErbD1XPB+lKFm5qVJh61q5GYZLMfWsib3oBZcis95V8yaHE9zZSQQCKN45QuJSTkMfUVvYaq1jK7wxRvvXawfJH0pJ3max3nuarprTCTfsti69p89lJDeaeTIzFg8bDz/Wl+n6pc20/exyOyJ1QyEZHQCksLoZAJX2r5n0q02ugWUgSZdRtzBIPCwlDYOP4h5fWgrhCaf2MnnfaLJpXbexieHvIbiJDwZGIYL/Wpe1utdldQ0tpTcma+dCIgm7wf82elURryXRLuS2TuponADqwDqw9qT3V7Ez5RCmc5Gf5e1LjxY5cp6GvPXHiw9rnb50doHaG80i6ae1lZd67XUYIYe+RVYFwWPJreOXNb3KpaZnltPaLbJr1zdlhLdFUcneoXAOT5gVBNJBG+IZRICM5AxSSJsDJrZrjHGaqZS9Ftt+xp8TnzrYTjGaTicetbCfzBphEht3x8jWvxDetLRce9Z781CaOOxsuKJjZDghenXmvV6vJ76DC0eAQElTuI44rC3SqwXbleN3vXq9Qz2Rlg0qOA2ks0g2SNgxIBkAep96Y2enG5tnm73btzxjrXq9XRj9kLiBKV12LckOy9SDWC2GxXq9T02KaNi6gcE5rIY45r1eqb0UTIrFSRjwjNSQOY5AzAlQecV6vUO9loP1NIoY02KM4DfQ80V2fvw10sWwgMcA5r1epL7ns0S9XpHRLRGtIVlcBlbitp9Ri24UnOPSvV6sXtnT9IpnarXr7uw1pHH3fIZnHOPOqrod8i6uks+fE3O3rk16vVuxJcDnZafNF1XWJ9LneCHdPFIchGOAtLNWsJr8vqXeIhP8A6YHT616vUEvj2hrXLaYmBiOUYOrjPPXJrCEg7fOvV6tibMbJFfnxZFb7iQzKcgV6vUW2RGven1rHe9a9XqZLKMGU+tamUjPv1969XqNFojF80DZQkEe3FDyXTSOWY8mvV6myVsY6fYvfbBbNlmXoxxyPKpb21lsnAZWwfNiP8jXq9S1kfPiP4LjsGa4OOc1oLj516vVoQtmfiPc1sJzXq9RERj4is/Ee5r1eqFn/2Q=="
  
  const cardLongPress=(ele)=>{
    setplanId(ele.ID);
    setVisible(true)
  }

  const confirmEdit=()=>{
    setVisible(false)
    navigation.navigate('AddTrip', { id: planId})
  }



  // const toggleVisibleMenu=(type,ele,key)=>{
  //   switch (type) {
  //     case "pastrips":
  //       pastrips[key].visible= !pastrips[key].visible;
  //       setpast([...pastrips])
  //       break;
  //     case "trips":
  //       trips[key]["visible"]= !trips[key].visible;
  //       setTrips([...trips])
  //       break;
  //     case "upcomingtrips":
  //       upcomingtrips[key]["visible"]= !upcomingtrips[key].visible;
  //       setUpcomingtrips([...upcomingtrips])
  //       break;
  //   }
  // }

  function ListComponent({ ele,type,index }) {
    return (
      <View style={{ marginBottom: 10 }}>
        <TouchableOpacity onPress={() =>
          navigation.navigate('Plans', { id: ele.ID, placeId: ele.placeId, destination: ele.destination })
        }  style={{ padding: 2 }}>
          <View>
          <Card>
            <Card.Title title={ele.name} titleStyle={{textTransform: "capitalize"}} subtitle={new Date(ele.startDate).toDateString() + ", " + new Date(ele.endDate).toDateString()}
            
            right={(props)=>{
              return <IconButton {...props} icon="ellipsis-v" onPress={() => {cardLongPress(ele)}} />
            }}
            />
            <Card.Content>
            </Card.Content>
            <Card.Cover source={{ uri: ele.destinationImage || defaultImagae}} />
          </Card>
          </View>
        </TouchableOpacity>
        
      </View>
    );
  }
  const hideDialog = () => setVisible(false);

  function randomIcon() {
    const icons = ["plane", "bed", "globe", "ship", "umbrella"]
    const random = Math.floor(Math.random() * icons.length);
    return icons[random]
  }


  function structureArr(results) {
    const lists = [];
    const count = results.rows.length;

    for (let i = 0; i < count; i++) {
      const row = results.rows.item(i);
      row.visible=false;
      lists.push(row);
    }
    return lists;
  }

  const PastlistItems = pastrips.map((ele, key) =>
    <ListComponent type="pastrips" ele={ele} key={key} index={key} />
  );

  const currentlistItems = trips.map((ele, key) =>
    <ListComponent type="trips" ele={ele} key={key} index={key} />
  );

  const upcominglistItems = upcomingtrips.map((ele, key) =>
    <ListComponent type="upcomingtrips" ele={ele} key={key} index={key} />
  );

  return (
    <View style={[styles.container]}>
        {/* <Text>{__DEV__.toString()}</Text> */}


      {/* {listItems.length > 0 ? (<ScrollView >
        {listItems}
      </ScrollView>) : <Text style={{color: colors.TextInput}}>Press + button to create plans</Text>} */}

      {
        (PastlistItems.length > 0 || currentlistItems.length > 0 || upcominglistItems.length > 0) ? (
          <ScrollView >

            {currentlistItems.length > 0 && <Title style={{ color: colors.text }}>OnGoing Trip</Title>}
            {currentlistItems}
            {upcominglistItems.length > 0 && (<Title style={{ color: colors.text }}>UpComing Trip</Title>)}
            {upcominglistItems}

            {PastlistItems.length > 0 && (<Title style={{ color: colors.text }}>Past Trip</Title>)}
            {PastlistItems}

          </ScrollView>
        ) : <Text style={{ color: colors.TextInput }}>Press + button to create trip</Text>}


        <Portal>
          <Dialog visible={visible} >
            <Dialog.Title>Are you sure to edit?</Dialog.Title>
            {/* <Dialog.Content>
              <Paragraph>Are you sure to edit?</Paragraph>
            </Dialog.Content> */}
            <Dialog.Actions>
              <Button onPress={hideDialog}>Cancel</Button>
              <Button onPress={confirmEdit}>Yes</Button>

            </Dialog.Actions>
          </Dialog>
        </Portal>


      <View style={{ position: "absolute", bottom: 20, right: 20 }}>
        <TouchableOpacity onPress={() => { navigation.navigate('AddTrip') }}>
          <View style={{
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            width: 60,
            height: 60,
            borderRadius: 100,
            backgroundColor: 'orange'
          }}>
            <IconFA size={40} />
            <IconFA name='plus' size={20} color='white' style={{ position: 'absolute', zIndex: 99 }} />
          </View>
        </TouchableOpacity>
      </View>
      <Notification />
    </View>
  );
};



