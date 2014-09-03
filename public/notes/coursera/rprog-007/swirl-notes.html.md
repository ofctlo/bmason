#Coursera R Programming

## Swirl Extra Credit Lessons

###Lesson 1

- given a vector `x <- c(1, 2, 3)`, `x * 2 == c(2, 4, 6)`. This works because
  `2` is equivalent to `c(2)`, and the vector of length 1 is 'recycled' until
  done multiplying each of the elements of `x`. So this is equivalent to `c(1,
  2, 3) * c(2, 2, 2)`.

###Lesson 3

####`paste()`
- When joining elements in a vector, paste must be used with the `collapse` option.
- When joining multiple vectors, either `collapse` or `sep` can be used to the
  same effect.

###Lesson 4

####`sample()`

  - usage: `sample(x, size)` takes a sample of size `size` from vector `x`
  - does not appear to sample in order from the given vector

####`is.*()`

  - given a vector `vec` with some `NA` and some doubles:
    - `is.na(vec)`: returns a vector of length `length(vec)`
    - `is.double(vec)`: returns a vector of length 1 (`TRUE`)

####`TRUE`, `FALSE`, and `NA`

  - `TRUE` is represented internally as `1`: summing `TRUE`s and `FALSE`s
    returns the number of `TRUE`s. However if there are any `NA`s the result
    will be `NA`
  - `NA == NA` returns `NA`, not `TRUE`
  - in addition to `NA` there is `NaN` which is returned for example when
    dividing by `Inf` or `0`

###Lesson 5

- Vectors start at index 1, not 0(!)
- `-c(1, 2, 3) == c(-1, -2, -3)`
- use `identical()` to test equality of entire vector
- Types of indexing
  - logical (`x[x > 4]`, `x[!is.na(x)]`): watch out for `NA`
  - positive numeric (`x[1]`): select elements at specified indices
  - negative numeric (`x[-1]`): select elements excluding specified indices
  - named: named vectors appear at first glance similar to
    hashes/dictionaries

###Lesson 6

- R objects have 'attributes', which can be viewed using `attributes()`
- Vectors have no dimension (`dim()`) attribute (the equivalent might be `length()`)
- the getter and setter are the same (`dim(vector) <- c(4, 5)` turns the vector
  into a matrix with 4 rows and 5 columns)
- matrices can only contain 1 data type
- data.frame objects can contain multiple types

###Lesson 7

  - [The Split-Apply-Combine Strategy for Data Analysis](http://www.jstatsoft.org/v40/i01/paper)
  - `lapply()` & `sapply()`: the two most important `*apply()` functions (loop
    functions)

###Questions for Rachel
- `rnorm()`: Normal Distribution...what does this do; what does this mean?
