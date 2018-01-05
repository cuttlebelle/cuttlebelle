---
layout: text/textblock
---

The main activity in Alpha stage is to test the hypotheses by building prototypes.

Alpha prototypes are like a proof of concept. They help you to test your understanding of the service. They will show if you have included the most important and meaningful steps the users take when going through the service.

Test with users using paper prototypes first. As you learn from your user research, work up to testing with interactive HTML prototypes.

### [2]What prototypes need

A good prototype is not the real service but needs to show how the service works. The prototype must:
- look and feel like a real digital service
- have enough features for users to interact with
- show a seamless user experience along the ‘happy path’
- use familiar design patterns — the [GOV.AU UI-Kit is an accessible CSS and JavaScript framework](https://github.com/govau/uikit) you can build with
- include content and data that looks real
- respond with alerts and feedback in the right places

The team tests which of these prototypes (if any) are best to carry forward, iterate based on feedback and test again.

Don’t spend too much time building the prototypes, as you will keep throwing them away and building new ones based on user feedback.

A prototype should not be functionally complete, have full end-to-end transactions or integrate with any working back-end systems. Just build the user journeys and user hypotheses you need to test.

It’s completely fine (and strongly recommended) to throw away the prototypes you build. You may choose to re-use some design patterns or components when you build in Beta stage, but you should not re-use a whole prototype.

### [2]Tools and technology for your prototypes

Technology should not be a blocker in prototyping. Choose tools for quick experimentation and rapid validation of the hypothesis.

Prototype by sketching in code, using HTML, CSS and JavaScript. Software like Axure, Omnigraffle or Balsamiq can be hard to use in a fully multidisciplinary working environment.

### [2]Use a static-site generator

Use a static-site generator (for example, [Jekyll](https://jekyllrb.com/)).

A static-site generator allows you to keep your prototype simple, with just HTML, CSS and JavaScript, but allows you to easily share templates and style sheets across multiple pages.

It is also easy for designers to make changes directly to the prototype, without having to wait on a developer to make changes.

Use a version control system, like [GitHub](https://github.com/), to store the code for your prototype so that everyone in the team can work across the same copy and collaborate on changes.

Deploy the prototype to a cloud service so that you can easily share it around the team and with your stakeholders (for example, [Amazon Web Services](https://aws.amazon.com/)).

If you configure the service to automatically deploy whenever changes are made (sometimes called ‘creating a build pipeline’), then everyone will always be able to access the most up-to-date version.

### [2]Use simple technology to make an interactive feature

Include some interactivity to simulate a working service in most prototypes (for example, capturing user details on a form). Don’t use server-side technology for this functionality (for example, Java, .NET or Ruby). You want to keep the technology simple so it’s quick and easy to update your prototypes.

Use client-side technologies (for example,  [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)) combined with a JavaScript framework (for example, [jQuery](https://jquery.com/)) to quickly store and retrieve information for the user’s session. Make it easy to reset and start again at the end of a user research session.

### [2]Don’t support every browser in the prototypes

Users are likely to be using the prototype in a controlled environment, such as a user research lab or on a team member's computer. This means that you need to support fewer browsers than a public website.

Support the latest version of each major browser (Chrome, Firefox, IE and Safari). Support a specific browser or version if a specific group of users or stakeholders depend on it.

Use semantic and accessible markup across prototypes.

As part of the user research test your prototypes with users who have accessibility needs. Test with screen reader software and other assistive technology.

### [2]Mobile first

More users are accessing government services using mobile devices than ever before. If you design and build for mobile first, you can test prototypes in a more realistic context.

To design for mobile you should make simple screen, with only 1 or 2 things on each page. This means that users with larger screens will also have an easier experience.
