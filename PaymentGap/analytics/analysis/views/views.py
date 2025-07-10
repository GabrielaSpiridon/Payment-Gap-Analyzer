from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
import pandas as pd
import MySQLdb

from analysis.handlers import handler_map

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_excel(request):
    # 1. Verificare existență fișier
    if not request.FILES.getlist('files') and not request.FILES.getlist('file'):
        return Response(
            {'error': 'No files uploaded. Use form field "file" or "files".'},
            status=status.HTTP_400_BAD_REQUEST
        )

    files = request.FILES.getlist('files') or request.FILES.getlist('file')
    results = []

    try:
        # 2. Deschidere conexiune DB cu setări statice
        conn = MySQLdb.connect(
            host="localhost",
            user="root",
            passwd="gabriela2003",
            db="payment_gap_db",
        )
        cursor = conn.cursor()

        # 3. Parcurgere fișiere
        for file_obj in files:
            table_name = file_obj.name.split('.')[0].lower()

            # 3.1 Validare extensie
            if not file_obj.name.lower().endswith(('.xlsx', '.xls')):
                results.append({
                    'fileName': file_obj.name,
                    'status': 'failed',
                    'message': 'Invalid extension, only .xlsx or .xls allowed.'
                })
                continue

            try:
                # 3.2 Citire Excel în DataFrame
                df = pd.read_excel(file_obj)

                # 3.3 Tratare în funcție de handler
                if table_name in handler_map:
                    inserted = handler_map[table_name](df, cursor)
                    results.append({
                        'fileName': file_obj.name,
                        'status': 'success',
                        'rowsInserted': inserted
                    })
                else:
                    results.append({
                        'fileName': file_obj.name,
                        'status': 'failed',
                        'message': f'Table "{table_name}" not supported.'
                    })

            except Exception as e:
                results.append({
                    'fileName': file_obj.name,
                    'status': 'failed',
                    'message': str(e)
                })

        # 4. Commit / rollback: atâta timp cât toate fișierele au trecut
        all_success = all(r['status'] == 'success' for r in results)
        if all_success:
            conn.commit()
        else:
            conn.rollback()

        cursor.close()
        conn.close()

        http_status = status.HTTP_200_OK if all_success else status.HTTP_400_BAD_REQUEST
        return Response({'results': results}, status=http_status)

    except Exception as e:
        # Eroare neașteptată
        return Response(
            {'error': f'Processing error: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
