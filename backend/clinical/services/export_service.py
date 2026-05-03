import csv
import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

class ExportService:
    @staticmethod
    def generate_csv(queryset, fields):
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(fields)
        for obj in queryset:
            row = []
            for field in fields:
                val = getattr(obj, field)
                if isinstance(val, list) or isinstance(val, dict):
                    import json
                    val = json.dumps(val)
                row.append(val)
            writer.writerow(row)
        return output.getvalue()

    @staticmethod
    def generate_pdf(queryset, title, user_name):
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()
        elements = []

        # Title
        elements.append(Paragraph(f"Relatório Clínico - {title}", styles['Title']))
        elements.append(Paragraph(f"Paciente: {user_name}", styles['Normal']))
        elements.append(Spacer(1, 12))

        # Data
        for obj in queryset:
            elements.append(Paragraph(f"Registro em: {obj.timestamp.strftime('%d/%m/%Y %H:%M')}", styles['Heading3']))
            
            # Dinamicamente extrai campos úteis
            if hasattr(obj, 'mood'):
                elements.append(Paragraph(f"Humor: {obj.mood}/10", styles['Normal']))
            if hasattr(obj, 'situacao'):
                elements.append(Paragraph(f"Situação: {obj.situacao}", styles['Normal']))
            if hasattr(obj, 'pensamento_automatico'):
                elements.append(Paragraph(f"Pensamento: {obj.pensamento_automatico}", styles['Normal']))
            
            elements.append(Spacer(1, 12))

        doc.build(elements)
        return buffer.getvalue()
