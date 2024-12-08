import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { Resource } from '@opentelemetry/resources';
import { B3Propagator } from '@opentelemetry/propagator-b3';
import { context, propagation } from '@opentelemetry/api';

const provider = new WebTracerProvider({
  resource: new Resource({
    'service.name': 'frontend-service',
  }),
});

const zipkinExporter = new ZipkinExporter({
  url: 'http://localhost:9414/api/v2/spans',
});

provider.addSpanProcessor(new SimpleSpanProcessor(zipkinExporter));
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.register();

// Utiliser le propagateur B3 pour la compatibilité avec Zipkin
propagation.setGlobalPropagator(new B3Propagator());

registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation({
      propagateTraceHeaderCorsUrls: ['http://localhost:8080'],
    }),
    new DocumentLoadInstrumentation(),
  ],
});

console.log('OpenTelemetry configured with service name: frontend-service');
