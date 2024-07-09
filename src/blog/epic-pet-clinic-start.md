---
title: 'Epic Pet Clinic: The Beginning'
publicationDate: '2024-07-09'
tags: 'Projects'
---

Starting the [Epic Pet Clinic](https://github.com/skanjo/epic-pet-clinic-spring-hilla) project, a ground up build of
[Spring Pet Clinic](https://github.com/skanjo/spring-petclinic) using the latest versions of Java,
[Spring](https://spring.io), and [Hilla](https://hilla.dev) and named
[Epic Pet Clinic: Spring Hilla Edition](https://github.com/skanjo/epic-pet-clinic-spring-hilla). The basic use cases and
wireframes have been captured in the [Epic Pet Clinic Spec](https://github.com/skanjo/epic-pet-clinic-spec) project
which will evolve to make *Epic Pet Clinic* a more useful application.

---

As of this writing the current versions that will be used are Java 22, Spring 3, and Hilla 24. The initial version will
only focus on the uses cases and wireframes as defined in
[v1.0](https://github.com/skanjo/epic-pet-clinic-spec/tree/v1.0) of the spec. [Maven](https://maven.apache.org) will be
used to build the project. I have been itching to use [SQLite](https://www.sqlite.org) for something and will do so for
this project as opposed to my personal default, [PostgreSQL](https://www.postgresql.org).

Once the initial spec has been implemented, I will update the spec to add features in order to make the application more
useful. For example, the current *Spring Pet Clinic* allows anonymous access, I will add user registration and login as
well as authorization to various parts of the application based on user role. Another example, it is not possible for
staff to view the entire schedule in order to plan for the day or understand if any one vet is overloaded, or if visits
are overlapping. For this case I will add a schedule view that allows staff to manage the schedule and filter by vet to
check individual schedules.

When adding features to the spec, I will then implement the feature in the *Epic Pet Clinic: Spring Hilla Edition*. I
will iterate on this until I feel that the result is a useful application allowing pet owners to schedule visits, review
history of visits for their pets and allow staff to review the schedule, manage owners and their pets, manage vet
schedules, and add SOAP notes to record visit outcomes and define treatment plans for pets.

Given the primary purpose of these projects is to learn the latest versions of commonly used technologies for
building, deploying, and monitoring web applications, after finishing the initial project, I will then switch to a
new set of language/framework combinations such as Java and HTMX (no Spring or Hilla), or Elixir/Phoenix, or Golang and
HTMX, or Swift and HTMX, etc. Not only will this provide me with recent experience using the latest tech, it should help
me to demonstrate that I can learn new things and get things done!

It is 2024 and jobs are scarce. As of this writing I am in need of job. Even after getting a job I would like to keep up
with this so that I do not lose touch with the latest technology. I feel having a spec and at least one implementation
will allow me to focus on 'the how' and not 'the what' for the next editions. Who knows, maybe the spec project will get
some interest and others will use it to create their own implementations.
