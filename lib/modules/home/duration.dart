import 'package:flutter/material.dart';
import 'package:flutter_one/routes/index.dart';

class HomeDuration extends StatefulWidget {
  final String title;

  const HomeDuration({Key? key, required this.title}) : super(key: key);

  @override
  _HomeDurationState createState() => _HomeDurationState();
}

class _HomeDurationState extends State<HomeDuration> {
  String title = '';

  @override
  void initState() {
    super.initState();
    title = widget.title;
    print('initState');
  }

  @override
  void didChangeDependencies() {
    // TODO: implement didChangeDependencies
    super.didChangeDependencies();
    print('didChangeDependencies');
  }

  @override
  void didUpdateWidget(covariant HomeDuration oldWidget) {
    // TODO: implement didUpdateWidget
    super.didUpdateWidget(oldWidget);
    print('didUpdateWidget');
    print(oldWidget);
  }

  @override
  void deactivate() {
    // TODO: implement deactivate
    super.deactivate();
    print('deactivate');
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    print('dispose');
  }

  void onPressAction() {
    // Navigator.of(context).pushNamed(Routes.homeDetailScreen);
    // GoBack();
    // Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    print('build');
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        GestureDetector(
          child: Text('$title'),
          onTap: () {
            // print('haha');
            // setState(() {
            //   title = 'duc dep trai';
            // });
            Navigator.of(context).pushNamed(Routes.homeDetailScreen);
          },
        ),
        GridView.count(
          shrinkWrap: true,
          primary: false,
          padding: const EdgeInsets.all(3),
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
          crossAxisCount: 6,
          children: <Widget>[
            Container(
              padding: const EdgeInsets.all(20),
              child: const Text("hahaha"),
              color: Colors.teal[100],
            ),
            Container(
              padding: const EdgeInsets.all(8),
              child: const Text('Heed not the rabble'),
              color: Colors.teal[200],
            ),
            Container(
              padding: const EdgeInsets.all(8),
              child: const Text('Sound of screams but the'),
              color: Colors.teal[300],
            ),
            Container(
              padding: const EdgeInsets.all(8),
              child: const Text('Who scream'),
              color: Colors.teal[400],
            ),
            Container(
              padding: const EdgeInsets.all(8),
              child: const Text('Revolution is coming...'),
              color: Colors.teal[500],
            ),
            Container(
              padding: const EdgeInsets.all(8),
              child: const Text('Revolution, they...'),
              color: Colors.teal[600],
            ),
            Container(
              padding: const EdgeInsets.all(8),
              child: const Text("He'd have you all unravel at the"),
              color: Colors.teal[100],
            ),
            Container(
              padding: const EdgeInsets.all(8),
              child: const Text("He'd have you all unravel at the"),
              color: Colors.teal[100],
            ),
            Container(
              padding: const EdgeInsets.all(8),
              child: const Text("He'd have you all unravel at the"),
              color: Colors.teal[100],
            ),
            Container(
              padding: const EdgeInsets.all(8),
              child: const Text("He'd have you all unravel at the"),
              color: Colors.teal[100],
            ),
            Container(
              padding: const EdgeInsets.all(8),
              child: const Text("He'd have you all unravel at the"),
              color: Colors.teal[100],
            ),
          ],
        )
      ],
    );
  }
}
