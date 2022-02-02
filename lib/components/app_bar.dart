import 'package:flutter/material.dart';

class BaseAppBar extends StatelessWidget implements PreferredSizeWidget {
  final Color backgroundColor = Colors.red;
  final Text? title;
  final AppBar appBar;
  final List<Widget> widgets;

  const BaseAppBar({
    Key? key,
    this.title,
    required this.appBar,
    required this.widgets,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: title,
      backgroundColor: Colors.white,
      leading: IconButton(
        icon: const Icon(
          Icons.arrow_back,
          color: Colors.black,
        ),
        onPressed: () {},
      ),
      actions: [
        GestureDetector(
          onTap: () {}, //onPressAction
          child: Column(
            children: [
              const Text(
                '222',
                style: TextStyle(color: Colors.black),
              ),
              GestureDetector(
                onTap: () {}, //onPressAction
                child: const Text(
                  '33333',
                  style: TextStyle(color: Colors.black),
                ),
              )
            ],
          ),
        ),
      ],
    );
  }

  @override
  Size get preferredSize => Size.fromHeight(appBar.preferredSize.height);
}
