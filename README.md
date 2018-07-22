# Fluid Outliner

Open source web based progressive outliner for your thoughts, ideas and daily tidbids.

## Development Status

Fluid Outliner is still in early development. 

![Screenshot](https://github.com/fluid-notion/fluid-outliner/raw/master/assets/screenshot.png)

## FAQs

1. **What is an outliner?**

    An application that helps you organize trees of information. Think of it as a bullet list on steroids.

2. **How do I install it ?**

    You can visit [this site](https://fluid-notion.github.io/fluid-outliner/) in your browser. Fluid Outliner is a web based application, no separate installation step is required.

3. **Can I access it offline ?**
  
    Yes. If you have visited the above site once while connected to internet, then you will be able to access it even when offline.

4. **Where is my data saved ?**
  
    Only in your browser.
  
    When you create an outline in your browser, it is simply cached in your browser's storage. You can save these outlines as files, open them in the application again, or share them with others.

    Your data is not saved to any servers and is not shared with any third party services.

    We may introduce synchronization through cloud services in future, but it will always be opt in and Fluid Outliner will always be a free and privacy focussed utility. 

    We also intend to introduce client side encryption to ensure that even if notes are synchronized through third party services, the actual data can't be accessed by said services. 

5. **Can I use it on mobile ?**

    Yes. But mobile support has not yet been extensively tested yet.

6. **Is any commercial support available ?**

    No.

7. **Will you accept donations?**
  
    No.

8. **I'd like feature [X] to be implemented**
  
    Please create an issue for it in Github. We can consider it in our roadmap if it improves the overall utility of the application but we can not provide any kind of timelines as most of the development happens in free time of contributors.

9. **I'd like to contribute [X] to the project**

    Thank you for your interest. If this is a minor bugfix or usability enhancement, please submit a pull request.

    If this is a new feature, or a major change, please create an issue before putting in a significant amount of effort. We would like to keep the feature set to a minimum to prevent bloat and to keep it accessible to new users.

10. **Is there an mobile or desktop app?**

    Early stage implementations can be found in the cordova-shell and electron-shell directories respectively. They are currently not stable enough for general use.

11. **Does it have all features from my favorite app: [X] ?**

    No.

12. **How long until has full feature parity with app/service/utility [X] ?**

    Unlikely to ever happen. 

## Todo

  - [ ] Improve performance for large outlines
  - [ ] Client side encryption of nodes
  - [ ] Support for embedding linked assets within outlines
  - [ ] Better mobile support
  - [ ] Easy content synchronization between mobile and desktop clients
  - [ ] Support for bookmarking zoom and filter states
  - [ ] Better test suite

## License

[![License: GPL v3](https://www.gnu.org/graphics/gplv3-127x51.png)](https://www.gnu.org/licenses/gpl-3.0)
