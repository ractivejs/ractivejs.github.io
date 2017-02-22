# ractive.getNodeInfo()

This is an instance specific version of [Ractive.getNodeInfo()](Ractive.getNodeInfo().md) that will only search the local instance DOM for a matching node when a selector is given. If the given value is not a string, then it is passed directly through to the static version of this method.

> ### ractive.getNodeInfo( node )
> Returns an object with helper methods to interact with the Ractive instance and context associated with the given node. See [helpers](Ractive.getNodeInfo().md#helpers).

> > #### **node** *`DOMNode`*
> > The DOM node for which you wish to retrieve the Ractive instance or view details. This is passed through directly to the static method.

> > #### **node** *`String`*
> > A css selector that will be passed to [ractive.find()](ractive.find().md). The resulting node will then be passed to the static method..

