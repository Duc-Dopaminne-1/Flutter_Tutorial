import 'package:flutter/material.dart';
import 'package:flutter_one/modules/home_detail_screen.dart';
import 'package:flutter_one/modules/home_main_screen.dart';
import 'routes/index.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      routes: <String, WidgetBuilder>{
        Routes.homeScreen: (context) => const HomeMainScreen(),
        Routes.homeDetailScreen: (context) => const HomeDetailScreen(),
      },
      home: const HomeMainScreen(),
    );
  }
}

// class HomeApp extends StatelessWidget {
//   const HomeApp({Key? key}) : super(key: key);
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         leading: IconButton(
//           icon: Icon(Icons.eighteen_mp_sharp),
//           onPressed: () {
//             print('2232222');
//           },
//         ),
//         leadingWidth: 500,
//         title: const Text('Duc Skt'),
//       ),
//       body: Center(
//         child: Column(
//           mainAxisSize: MainAxisSize.max,
//           children: [
//             TextButton(
//                 clipBehavior: Clip.antiAlias,
//                 style: TextButton.styleFrom(
//                     padding: const EdgeInsets.fromLTRB(20.0, 40.0, 100.0, 20.0),
//                     textStyle: const TextStyle(fontSize: 10),
//                     onSurface: Colors.red,
//                     shadowColor: Colors.green,
//                     primary: Colors.black,
//                     elevation: 20.2,
//                     enableFeedback: false,
//                     backgroundColor: Colors.amberAccent),
//                 onPressed: () {},
//                 child: const Text(
//                   'React Native is the best',
//                   style: TextStyle(fontSize: 40, backgroundColor: Colors.red),
//                 )),
//             const SizedBox(
//               height: 10,
//             ),
//             TextButton(
//                 onPressed: () {},
//                 child: const Text(
//                   'HEHE',
//                   style: TextStyle(backgroundColor: Colors.red),
//                 ))
//           ],
//         ),
//       ),
//     );
//   }
// }

//     child: Text.rich(
//   TextSpan(
//       text: '1111',
//       children: [TextSpan(text: '222'), TextSpan(text: '3333')],
//       style: TextStyle(color: Colors.red)),
// )
